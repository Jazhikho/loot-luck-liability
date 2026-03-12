import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Game from "./Game.jsx";
import { I18nProvider, resetLocaleState } from "./i18n/index.jsx";
import { CombatView } from "./screens/CombatView.jsx";
import { ProfileScreen } from "./screens/ProfileScreen.jsx";
import { TitleScreen } from "./screens/TitleScreen.jsx";
import { APP_VERSION } from "./utils/AppVersion.js";
import { getDungeonCatalog } from "./utils/DungeonCatalog.js";

const originalLanguage = window.navigator.language;

function setBrowserLanguage(language) {
  Object.defineProperty(window.navigator, "language", {
    configurable: true,
    value: language,
  });
}

function renderWithI18n(ui) {
  return render(<I18nProvider>{ui}</I18nProvider>);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

describe("Loot, Luck & Liability", () => {
  beforeEach(() => {
    localStorage.clear();
    setBrowserLanguage("en-US");
    resetLocaleState();
  });

  afterEach(() => {
    localStorage.clear();
    setBrowserLanguage(originalLanguage);
    resetLocaleState();
    vi.restoreAllMocks();
  });

  it("falls back to the shop when a saved combat state has no foe", async () => {
    localStorage.setItem(
      "ll_save",
      JSON.stringify({
        version: 1,
        view: "combat",
        p: { hp: 50, mhp: 50, atk: 5, def: 2, gold: 10, wlv: 1, alv: 1, pot: 2 },
        inv: [],
        dng: null,
        fl: 0,
        rooms: 0,
        foe: null,
        af: null,
        unlocked: [1, 2],
        rs: { earned: 0, slain: 0, deepest: 0, rooms: 0, clears: 0 },
        log: [],
      })
    );

    render(<Game />);

    expect(await screen.findByRole("heading", { name: "The Broker's Snug" })).toBeInTheDocument();
  });

  it("awards a dungeon clear only after returning safely from the deepest floor", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99);
    const user = userEvent.setup();

    render(<Game />);

    await user.click(screen.getByRole("button", { name: "Start Adventuring" }));
    await user.click(screen.getByRole("button", { name: "Chase the Green Dark" }));
    await user.click(screen.getByRole("button", { name: /The Clover Cellar/i }));

    expect(await screen.findByRole("heading", { name: /Floor 1\/3/ })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Descend to Floor 2/i }));
    await user.click(screen.getByRole("button", { name: /Descend to Floor 3/i }));

    await user.click(screen.getByRole("button", { name: "Ledger" }));
    const beforeClearCard = screen.getByText("Dungeons Cleared").parentElement;
    expect(within(beforeClearCard).getByText("0")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Back" }));
    await user.click(screen.getByRole("button", { name: /Retreat to Town/i }));

    expect(await screen.findByRole("heading", { name: "The Broker's Snug" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Ledger" }));
    const afterClearCard = screen.getByText("Dungeons Cleared").parentElement;
    expect(within(afterClearCard).getByText("1")).toBeInTheDocument();
  });

  it("requires confirmation before starting a new run over an existing save", async () => {
    localStorage.setItem("ll_save", JSON.stringify({ view: "shop" }));
    const newGame = vi.fn();
    const user = userEvent.setup();

    renderWithI18n(<TitleScreen toasts={[]} continueGame={vi.fn()} newGame={newGame} goProfile={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Start a Fresh Misadventure" }));
    expect(newGame).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Start Fresh Run" }));
    expect(newGame).toHaveBeenCalledTimes(1);
  });

  it("opens credits from the title screen and shows the versioned credits block", async () => {
    const user = userEvent.setup();

    renderWithI18n(<TitleScreen toasts={[]} continueGame={vi.fn()} newGame={vi.fn()} goProfile={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Credits" }));

    expect(screen.getByText("Jazhikho")).toBeInTheDocument();
    expect(screen.getByText(/Claude Sonnet/i)).toBeInTheDocument();
    expect(screen.getByText(/Codex \(GPT 5\.4\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Joel Croteau/i)).toBeInTheDocument();
    expect(screen.queryByText(/Timbot/i)).not.toBeInTheDocument();
    expect(screen.getByText(new RegExp(`v${escapeRegExp(APP_VERSION)}`, "i"))).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Back to Title" }));
    expect(screen.getByRole("button", { name: "Start Adventuring" })).toBeInTheDocument();
  });

  it("lets the player manually switch between English and Spanish from the title screen", async () => {
    const user = userEvent.setup();

    renderWithI18n(<TitleScreen toasts={[]} continueGame={vi.fn()} newGame={vi.fn()} goProfile={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Start Adventuring" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Espa/i }));

    expect(screen.getByRole("button", { name: /Empezar/i })).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("ll_locale_pref"))).toEqual({ source: "manual", locale: "es" });
  });

  it("requires confirmation before deleting all data", async () => {
    const nukeData = vi.fn();
    const user = userEvent.setup();

    renderWithI18n(
      <ProfileScreen
        toasts={[]}
        prevView="shop"
        setView={vi.fn()}
        profTab="stats"
        setProfTab={vi.fn()}
        lt={{ gold: 0, slain: 0, deaths: 0, clears: 0, rooms: 0, items: 0, potions: 0, runs: 0, bestFloor: 0 }}
        ach={[]}
        hs={[]}
        nukeData={nukeData}
      />
    );

    await user.click(screen.getByRole("button", { name: "Delete All Data" }));
    expect(nukeData).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Delete Everything" }));
    expect(nukeData).toHaveBeenCalledTimes(1);
  });

  it("keeps the achievements view in an internal scroll panel", () => {
    renderWithI18n(
      <ProfileScreen
        toasts={[]}
        prevView="shop"
        setView={vi.fn()}
        profTab="ach"
        setProfTab={vi.fn()}
        lt={{ gold: 0, slain: 0, deaths: 0, clears: 0, rooms: 0, items: 0, potions: 0, runs: 0, bestFloor: 0, bestLuck: 0 }}
        ach={[]}
        hs={[]}
        nukeData={vi.fn()}
      />
    );

    expect(screen.getByTestId("achievements-panel").className).toMatch(/overflow-y-auto/);
  });

  it("disables potion use in combat at full health", () => {
    renderWithI18n(
      <CombatView
        foe={{ name: "Test Foe", emoji: "X", hp: 10, maxHp: 10, atk: 2, def: 1 }}
        p={{ hp: 20, mhp: 20, pot: 2 }}
        doAttack={vi.fn()}
        usePot={vi.fn()}
        doFlee={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: /Tonic \(2\)/i })).toBeDisabled();
  });

  it("warns when combat is one bad hit from lethal", () => {
    renderWithI18n(
      <CombatView
        foe={{ name: "Coin Wraith", emoji: "W", hp: 10, maxHp: 10, atk: 6, def: 1 }}
        p={{ hp: 6, mhp: 20, def: 2, pot: 1 }}
        doAttack={vi.fn()}
        usePot={vi.fn()}
        doFlee={vi.fn()}
      />
    );

    expect(screen.getByText(/ends this run|acaba con esta partida/i)).toBeInTheDocument();
  });

  it("shows the newest combat text in a central story panel", () => {
    renderWithI18n(
      <CombatView
        foe={{ name: "Coin Wraith", emoji: "W", hp: 10, maxHp: 10, atk: 6, def: 1 }}
        p={{ hp: 10, mhp: 20, def: 2, pot: 1 }}
        doAttack={vi.fn()}
        usePot={vi.fn()}
        doFlee={vi.fn()}
        storyEntries={[
          { id: "1", msg: "The coin wraith hisses about the RNG.", type: "bad" },
          { id: "2", msg: "You trip, recover, and somehow land a perfect hit.", type: "hit" },
        ]}
      />
    );

    expect(screen.getByText("Battle Chatter")).toBeInTheDocument();
    expect(screen.getByText(/You trip, recover, and somehow land a perfect hit\./i)).toBeInTheDocument();
  });

  it("uses the main log instead of a separate commentary panel on the floor hub", async () => {
    localStorage.setItem(
      "ll_save",
      JSON.stringify({
        version: 3,
        view: "floorHub",
        p: { hp: 42, mhp: 50, atk: 5, def: 2, gold: 10, wlv: 1, alv: 1, pot: 2, luck: 0 },
        inv: [],
        dng: getDungeonCatalog([1, 2]).find((dungeon) => dungeon.id === 1),
        fl: 1,
        rooms: 2,
        ef: [1],
        foe: null,
        af: null,
        unlocked: [1, 2],
        rs: { earned: 0, slain: 0, deepest: 1, rooms: 2, clears: 0 },
        log: [{ id: "log-1", msg: "The rainbow mimic sulks in the log where it belongs.", type: "bad" }],
      })
    );

    render(<Game />);

    expect(await screen.findByRole("heading", { name: /Floor 1\/3/i })).toBeInTheDocument();
    const logBox = screen.getByText("Rumors & Wreckage").closest(".rounded-xl");

    expect(logBox).toBeInTheDocument();
    expect(screen.queryByText("Dungeon Commentary")).not.toBeInTheDocument();
    expect(within(logBox).getAllByText(/The rainbow mimic sulks in the log where it belongs\./i).length).toBeGreaterThan(0);
  });

  it("buys run luck upgrades at the fixed cost and updates the display", async () => {
    localStorage.setItem(
      "ll_save",
      JSON.stringify({
        version: 2,
        view: "shop",
        p: { hp: 50, mhp: 50, atk: 5, def: 2, gold: 60, wlv: 1, alv: 1, pot: 2, luck: 0 },
        inv: [],
        dng: null,
        fl: 0,
        rooms: 0,
        foe: null,
        af: null,
        unlocked: [1, 2],
        rs: { earned: 0, slain: 0, deepest: 0, rooms: 0, clears: 0 },
        log: [],
      })
    );
    const user = userEvent.setup();

    render(<Game />);

    expect(await screen.findByText("Base Luck 0. Active Luck 0. Lucky cargo in hand: 0.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Luck +1 (20g)" }));

    expect(screen.getByText("Base Luck 1. Active Luck 1. Lucky cargo in hand: 0.")).toBeInTheDocument();
    expect(screen.getByText("Gold 40g")).toBeInTheDocument();
    expect(screen.getByText("Luck 1/1")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Luck +1 (35g)" })).toBeInTheDocument();
  });

  it("keeps locked cargo out of bulk cash-ins", async () => {
    localStorage.setItem(
      "ll_save",
      JSON.stringify({
        version: 3,
        view: "shop",
        p: { hp: 50, mhp: 50, atk: 5, def: 2, gold: 10, wlv: 1, alv: 1, pot: 2, luck: 0 },
        inv: [
          { id: "hold-1", name: "Lucky Ledger", value: 50, emoji: "L", rarity: "rare", luck: 2, locked: false },
          { id: "hold-2", name: "Pub Token", value: 10, emoji: "P", rarity: "common", luck: 0, locked: false },
        ],
        dng: null,
        fl: 0,
        rooms: 0,
        foe: null,
        af: null,
        unlocked: [1, 2],
        rs: { earned: 0, slain: 0, deepest: 0, rooms: 0, clears: 0 },
        log: [],
      })
    );
    const user = userEvent.setup();

    render(<Game />);

    await screen.findByRole("heading", { name: "The Broker's Snug" });
    const luckyRow = screen.getByText(/Lucky Ledger/).closest("div");
    await user.click(within(luckyRow).getByRole("button", { name: "Hold" }));
    expect(within(luckyRow).getByRole("button", { name: "Held" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cash In (10g)" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cash In (10g)" }));

    expect(screen.getByText("Gold 20g")).toBeInTheDocument();
    expect(screen.getByText("Cargo 1")).toBeInTheDocument();
    expect(screen.getByText(/Lucky Ledger/)).toBeInTheDocument();
  });

  it("removes carried luck immediately when lucky cargo is sold", async () => {
    localStorage.setItem(
      "ll_save",
      JSON.stringify({
        version: 2,
        view: "shop",
        p: { hp: 50, mhp: 50, atk: 5, def: 2, gold: 10, wlv: 1, alv: 1, pot: 2, luck: 0 },
        inv: [{ id: "lucky-1", name: "Lucky Ledger", value: 50, emoji: "L", rarity: "rare", luck: 2 }],
        dng: null,
        fl: 0,
        rooms: 0,
        foe: null,
        af: null,
        unlocked: [1, 2],
        rs: { earned: 0, slain: 0, deepest: 0, rooms: 0, clears: 0 },
        log: [],
      })
    );
    const user = userEvent.setup();

    render(<Game />);

    expect(await screen.findByText("Luck 0/2")).toBeInTheDocument();
    expect(screen.getByText("Base Luck 0. Active Luck 2. Lucky cargo in hand: 1.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "50g" }));

    expect(screen.getByText("Luck 0/0")).toBeInTheDocument();
    expect(screen.getByText("Base Luck 0. Active Luck 0. Lucky cargo in hand: 0.")).toBeInTheDocument();
    expect(screen.getByText("Gold 60g")).toBeInTheDocument();
  });

  it("exposes luck state through render_game_to_text", async () => {
    localStorage.setItem(
      "ll_save",
      JSON.stringify({
        version: 2,
        view: "shop",
        p: { hp: 50, mhp: 50, atk: 5, def: 2, gold: 10, wlv: 1, alv: 1, pot: 2, luck: 1 },
        inv: [{ id: "lucky-2", name: "Charm", value: 12, emoji: "C", rarity: "common", luck: 1 }],
        dng: null,
        fl: 0,
        rooms: 0,
        foe: null,
        af: null,
        unlocked: [1, 2],
        rs: { earned: 0, slain: 0, deepest: 0, rooms: 0, clears: 0 },
        log: [],
      })
    );

    render(<Game />);

    await screen.findByRole("heading", { name: "The Broker's Snug" });
    const payload = JSON.parse(window.render_game_to_text());

    expect(payload.player.luck).toBe(1);
    expect(payload.inventory.luckTotal).toBe(2);
    expect(payload.inventory.luckyItemCount).toBe(1);
    expect(payload.luckTier).toBe("fortunate");
  });

  it("shows newly discovered procedural dungeons after enough unlocks", async () => {
    const discoveredDungeon = getDungeonCatalog([1, 2, 3, 4]).find((dungeon) => dungeon.generated);
    localStorage.setItem(
      "ll_save",
      JSON.stringify({
        version: 2,
        view: "shop",
        p: { hp: 50, mhp: 50, atk: 5, def: 2, gold: 600, wlv: 1, alv: 1, pot: 2, luck: 0 },
        inv: [],
        dng: null,
        fl: 0,
        rooms: 0,
        foe: null,
        af: null,
        unlocked: [1, 2, 3, 4],
        rs: { earned: 0, slain: 0, deepest: 0, rooms: 0, clears: 0 },
        log: [],
      })
    );
    const user = userEvent.setup();

    render(<Game />);

    await screen.findByRole("heading", { name: "The Broker's Snug" });
    await user.click(screen.getByRole("button", { name: "Chase the Green Dark" }));

    expect(await screen.findByRole("button", { name: new RegExp(discoveredDungeon.name, "i") })).toBeInTheDocument();
    expect(screen.getByText("Fresh rumor")).toBeInTheDocument();
  });

  it("auto-resolves the first room when you first land on floor one", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99);
    const user = userEvent.setup();

    render(<Game />);

    await user.click(screen.getByRole("button", { name: "Start Adventuring" }));
    await user.click(screen.getByRole("button", { name: "Chase the Green Dark" }));
    await user.click(screen.getByRole("button", { name: /The Clover Cellar/i }));

    expect(await screen.findByRole("heading", { name: /Floor 1\/3/ })).toBeInTheDocument();
    expect(screen.getByText(/Rooms searched: 1/i)).toBeInTheDocument();

    const payload = JSON.parse(window.render_game_to_text());
    expect(payload.enteredFloors).toEqual([1]);
    expect(payload.dungeon.floor).toBe(1);
    expect(payload.dungeon.rooms).toBe(1);
    expect(payload.forcedEntryActive).toBe(false);
  });

  it("auto-resolves the first room when descending to a new floor", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99);
    const user = userEvent.setup();

    render(<Game />);

    await user.click(screen.getByRole("button", { name: "Start Adventuring" }));
    await user.click(screen.getByRole("button", { name: "Chase the Green Dark" }));
    await user.click(screen.getByRole("button", { name: /The Clover Cellar/i }));
    await user.click(screen.getByRole("button", { name: /Descend to Floor 2/i }));

    expect(await screen.findByRole("heading", { name: /Floor 2\/3/ })).toBeInTheDocument();
    expect(screen.getByText(/Rooms searched: 1/i)).toBeInTheDocument();

    const payload = JSON.parse(window.render_game_to_text());
    expect(payload.enteredFloors).toEqual([1, 2]);
    expect(payload.dungeon.floor).toBe(2);
    expect(payload.dungeon.rooms).toBe(1);
  });

  it("warns before leaving town hurt and lets the player cancel", async () => {
    localStorage.setItem(
      "ll_save",
      JSON.stringify({
        version: 3,
        view: "shop",
        p: { hp: 18, mhp: 50, atk: 5, def: 2, gold: 25, wlv: 1, alv: 1, pot: 2, luck: 0 },
        inv: [],
        dng: null,
        fl: 0,
        rooms: 0,
        foe: null,
        af: null,
        unlocked: [1, 2],
        rs: { earned: 0, slain: 0, deepest: 0, rooms: 0, clears: 0 },
        log: [],
      })
    );
    const user = userEvent.setup();

    render(<Game />);

    await screen.findByRole("heading", { name: "The Broker's Snug" });
    expect(screen.getByText(/You are still hurt\./i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Chase the Green Dark" }));

    expect(screen.getByText(/You're heading out at 18\/50 HP/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.getByRole("heading", { name: "The Broker's Snug" })).toBeInTheDocument();
    expect(screen.queryByText(/Leave town while hurt\?/i)).not.toBeInTheDocument();
  });

  it("lets a hurt player confirm the warning and continue to dungeon selection", async () => {
    localStorage.setItem(
      "ll_save",
      JSON.stringify({
        version: 3,
        view: "shop",
        p: { hp: 18, mhp: 50, atk: 5, def: 2, gold: 25, wlv: 1, alv: 1, pot: 2, luck: 0 },
        inv: [],
        dng: null,
        fl: 0,
        rooms: 0,
        foe: null,
        af: null,
        unlocked: [1, 2],
        rs: { earned: 0, slain: 0, deepest: 0, rooms: 0, clears: 0 },
        log: [],
      })
    );
    const user = userEvent.setup();

    render(<Game />);

    await screen.findByRole("heading", { name: "The Broker's Snug" });
    await user.click(screen.getByRole("button", { name: "Chase the Green Dark" }));
    await user.click(screen.getByRole("button", { name: "Leave Hurt Anyway" }));

    expect(await screen.findByRole("heading", { name: /Choose a Fortune Hunt/i })).toBeInTheDocument();
  });

  it("goes straight to dungeon selection when leaving town at full health", async () => {
    const user = userEvent.setup();

    render(<Game />);

    await user.click(screen.getByRole("button", { name: "Start Adventuring" }));
    await user.click(screen.getByRole("button", { name: "Chase the Green Dark" }));

    expect(await screen.findByRole("heading", { name: /Choose a Fortune Hunt/i })).toBeInTheDocument();
    expect(screen.queryByText(/Leave town while hurt\?/i)).not.toBeInTheDocument();
  });

  it("exposes departure warnings and story state through render_game_to_text", async () => {
    localStorage.setItem(
      "ll_save",
      JSON.stringify({
        version: 3,
        view: "shop",
        p: { hp: 18, mhp: 50, atk: 5, def: 2, gold: 10, wlv: 1, alv: 1, pot: 2, luck: 1 },
        inv: [{ id: "lucky-2", name: "Charm", value: 12, emoji: "C", rarity: "common", luck: 1 }],
        dng: null,
        fl: 0,
        rooms: 0,
        foe: null,
        af: null,
        unlocked: [1, 2],
        rs: { earned: 0, slain: 0, deepest: 0, rooms: 0, clears: 0 },
        log: [{ id: "log-1", msg: "The snug eyes your bandages suspiciously.", type: "warn" }],
      })
    );
    const user = userEvent.setup();

    render(<Game />);

    await screen.findByRole("heading", { name: "The Broker's Snug" });
    await user.click(screen.getByRole("button", { name: "Chase the Green Dark" }));
    const payload = JSON.parse(window.render_game_to_text());

    expect(payload.departureWarningOpen).toBe(true);
    expect(payload.locale).toBe("en");
    expect(payload.localeSource).toBe("auto");
    expect(payload.story.latest).toBe("The snug eyes your bandages suspiciously.");
    expect(payload.story.recent).toContain("The snug eyes your bandages suspiciously.");
  });
});
