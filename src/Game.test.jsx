import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Game from "./Game.jsx";
import { CombatView } from "./screens/CombatView.jsx";
import { ProfileScreen } from "./screens/ProfileScreen.jsx";
import { TitleScreen } from "./screens/TitleScreen.jsx";

describe("Loot & Liability", () => {
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

    expect(await screen.findByText("The Merchant's Shop")).toBeInTheDocument();
  });

  it("awards a dungeon clear only after returning safely from the deepest floor", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99);
    const user = userEvent.setup();

    render(<Game />);

    await user.click(screen.getByRole("button", { name: "Start Adventuring" }));
    await user.click(screen.getByRole("button", { name: /Dungeon/i }));
    await user.click(screen.getByRole("button", { name: /The Slightly Damp Cave/i }));

    expect(await screen.findByRole("heading", { name: /Floor 1\/3/ })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Descend to Floor 2/i }));
    await user.click(screen.getByRole("button", { name: /Descend to Floor 3/i }));

    await user.click(screen.getByRole("button", { name: "Stats" }));
    const beforeClearCard = screen.getByText("Dungeons Cleared").parentElement;
    expect(within(beforeClearCard).getByText("0")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Back" }));
    await user.click(screen.getByRole("button", { name: /Retreat to Shop/i }));

    expect(await screen.findByText("The Merchant's Shop")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Stats" }));
    const afterClearCard = screen.getByText("Dungeons Cleared").parentElement;
    expect(within(afterClearCard).getByText("1")).toBeInTheDocument();
  });

  it("requires confirmation before starting a new run over an existing save", async () => {
    localStorage.setItem("ll_save", JSON.stringify({ view: "shop" }));
    const newGame = vi.fn();
    const user = userEvent.setup();

    render(<TitleScreen toasts={[]} continueGame={vi.fn()} newGame={newGame} goProfile={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "New Game" }));
    expect(newGame).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Start New Run" }));
    expect(newGame).toHaveBeenCalledTimes(1);
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

    expect(screen.getByRole("button", { name: /Potion \(2\)/i })).toBeDisabled();
  });
});
