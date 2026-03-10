import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Game from "./Game.jsx";
import { CombatView } from "./screens/CombatView.jsx";
import { ProfileScreen } from "./screens/ProfileScreen.jsx";
import { TitleScreen } from "./screens/TitleScreen.jsx";
import { getDungeonCatalog } from "./utils/DungeonCatalog.js";

describe("Loot, Luck & Liability", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
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

    render(<TitleScreen toasts={[]} continueGame={vi.fn()} newGame={newGame} goProfile={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Start a Fresh Misadventure" }));
    expect(newGame).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Start Fresh Run" }));
    expect(newGame).toHaveBeenCalledTimes(1);
  });

  it("opens credits from the title screen and shows the versioned credits block", async () => {
    const user = userEvent.setup();

    render(<TitleScreen toasts={[]} continueGame={vi.fn()} newGame={vi.fn()} goProfile={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Credits" }));

    expect(screen.getByText("Jazhikho")).toBeInTheDocument();
    expect(screen.getByText(/Claude Sonnet/i)).toBeInTheDocument();
    expect(screen.getByText(/Codex \(GPT 5\.4\)/i)).toBeInTheDocument();
    expect(screen.getByText(/v1\.3\.0/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Back to Title" }));
    expect(screen.getByRole("button", { name: "Start Adventuring" })).toBeInTheDocument();
  });

  it("requires confirmation before deleting all data", async () => {
    const nukeData = vi.fn();
    const user = userEvent.setup();

    render(
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

  it("disables potion use in combat at full health", () => {
    render(
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
});
