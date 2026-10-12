(function exposeStoryModeWorld(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.StoryModeWorld = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createStoryModeWorld() {
  "use strict";

  const MAP = Object.freeze({
    width: 1000,
    height: 700,
    tileSize: 100,
    columns: 10,
    rows: 7
  });

  const PLAYER = Object.freeze({
    width: 52,
    height: 62,
    footInsetX: 12,
    footInsetY: 42,
    footWidth: 28,
    footHeight: 17,
    speed: 190
  });

  const SPAWN = Object.freeze({ x: 94, y: 500, facing: "up" });
  const MAESTRO_RETURN = Object.freeze({ x: 276, y: 432, facing: "left" });
  const MAESTRO = Object.freeze({ x: 154, y: 338, width: 92, height: 128 });
  const GREMLIN = Object.freeze({ x: 760, y: 304, width: 82, height: 82 });
  const GREMLIN_ENCOUNTER = Object.freeze({ x: 734, y: 280, width: 134, height: 132 });
  const MAESTRO_INTERACTION = Object.freeze({ x: 102, y: 288, width: 196, height: 230 });

  const OBSTACLES = Object.freeze([
    Object.freeze({ id: "furnace", x: 70, y: 82, width: 174, height: 160 }),
    Object.freeze({ id: "workbench", x: 352, y: 116, width: 272, height: 106 }),
    Object.freeze({ id: "parts-rack", x: 705, y: 72, width: 196, height: 118 }),
    Object.freeze({ id: "anvil", x: 424, y: 348, width: 120, height: 92 }),
    Object.freeze({ id: "crates", x: 680, y: 538, width: 180, height: 98 })
  ]);

  const DIRECTIONS = Object.freeze({
    up: Object.freeze({ x: 0, y: -1 }),
    down: Object.freeze({ x: 0, y: 1 }),
    left: Object.freeze({ x: -1, y: 0 }),
    right: Object.freeze({ x: 1, y: 0 })
  });

  function copyPlayer(player) {
    return { x: player.x, y: player.y, facing: player.facing };
  }

  function cloneState(state) {
    return {
      player: copyPlayer(state.player),
      movementLocked: Boolean(state.movementLocked),
      gremlinState: state.gremlinState,
      encounterEnabled: Boolean(state.encounterEnabled),
      encounterLatched: Boolean(state.encounterLatched),
      lastBattleResult: state.lastBattleResult || null
    };
  }

  function createState() {
    return {
      player: copyPlayer(SPAWN),
      movementLocked: true,
      gremlinState: "active",
      encounterEnabled: true,
      encounterLatched: false,
      lastBattleResult: null
    };
  }

  function intersects(a, b) {
    return a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y;
  }

  function playerFeetAt(x, y) {
    return {
      x: x + PLAYER.footInsetX,
      y: y + PLAYER.footInsetY,
      width: PLAYER.footWidth,
      height: PLAYER.footHeight
    };
  }

  function insideBounds(x, y) {
    const feet = playerFeetAt(x, y);
    return feet.x >= 18 && feet.y >= 18 &&
      feet.x + feet.width <= MAP.width - 18 &&
      feet.y + feet.height <= MAP.height - 18;
  }

  function blockedRects(state) {
    const enemy = state.gremlinState === "active"
      ? GREMLIN
      : { x: GREMLIN.x + 4, y: GREMLIN.y + 36, width: GREMLIN.width - 8, height: 42 };
    return [...OBSTACLES, MAESTRO, enemy];
  }

  function positionIsBlocked(state, x, y) {
    const feet = playerFeetAt(x, y);
    return !insideBounds(x, y) || blockedRects(state).some((rect) => intersects(feet, rect));
  }

  function movePlayer(state, direction, elapsedSeconds) {
    const next = cloneState(state);
    if (next.movementLocked || !DIRECTIONS[direction]) {
      return { state: next, moved: false, encounterTriggered: false };
    }

    const seconds = Math.max(0, Math.min(Number(elapsedSeconds) || 0, 0.05));
    const vector = DIRECTIONS[direction];
    const distance = PLAYER.speed * seconds;
    const targetX = next.player.x + vector.x * distance;
    const targetY = next.player.y + vector.y * distance;
    let moved = false;

    if (!positionIsBlocked(next, targetX, next.player.y)) {
      next.player.x = targetX;
      moved = moved || vector.x !== 0;
    }
    if (!positionIsBlocked(next, next.player.x, targetY)) {
      next.player.y = targetY;
      moved = moved || vector.y !== 0;
    }
    next.player.facing = direction;

    const encounterTriggered = next.gremlinState === "active" &&
      next.encounterEnabled &&
      !next.encounterLatched &&
      intersects(playerFeetAt(next.player.x, next.player.y), GREMLIN_ENCOUNTER);

    if (encounterTriggered) {
      next.encounterLatched = true;
      next.movementLocked = true;
    }

    return { state: next, moved, encounterTriggered };
  }

  function setMovementLocked(state, locked) {
    const next = cloneState(state);
    next.movementLocked = Boolean(locked);
    return next;
  }

  function canTalkToMaestro(state) {
    return intersects(playerFeetAt(state.player.x, state.player.y), MAESTRO_INTERACTION);
  }

  function returnToMaestro(state, result) {
    const next = cloneState(state);
    next.player = copyPlayer(MAESTRO_RETURN);
    next.movementLocked = true;
    next.encounterLatched = true;
    next.lastBattleResult = result;
    if (result === "VICTORY") {
      next.gremlinState = "defeated";
      next.encounterEnabled = false;
    } else {
      next.gremlinState = "active";
      next.encounterEnabled = true;
    }
    return next;
  }

  function finishSafeReturn(state) {
    const next = cloneState(state);
    next.movementLocked = false;
    next.encounterLatched = false;
    return next;
  }

  function prepareTrainingEncounter(state) {
    const next = cloneState(state);
    next.gremlinState = "active";
    next.encounterEnabled = true;
    next.encounterLatched = false;
    next.movementLocked = false;
    return next;
  }

  function placePlayer(state, x, y, facing) {
    const next = cloneState(state);
    if (positionIsBlocked(next, x, y)) throw new RangeError("The requested player position is blocked.");
    next.player = { x, y, facing: DIRECTIONS[facing] ? facing : next.player.facing };
    return next;
  }

  return Object.freeze({
    MAP,
    PLAYER,
    SPAWN,
    MAESTRO_RETURN,
    MAESTRO,
    MAESTRO_INTERACTION,
    GREMLIN,
    GREMLIN_ENCOUNTER,
    OBSTACLES,
    DIRECTIONS,
    createState,
    cloneState,
    intersects,
    playerFeetAt,
    positionIsBlocked,
    movePlayer,
    setMovementLocked,
    canTalkToMaestro,
    returnToMaestro,
    finishSafeReturn,
    prepareTrainingEncounter,
    placePlayer
  });
});
