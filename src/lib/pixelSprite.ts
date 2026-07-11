/**
 * Pixel-art sprite of Navashri — hand-drawn as character maps so every
 * frame (walk, blink, point) stays crisp at any scale and can be redrawn
 * on canvas without shipping image assets. Palette keys map to the
 * site's warm starlight colors.
 */

export const PALETTE: Record<string, string> = {
  o: "#241418", // outline
  h: "#7c4a2c", // hair
  H: "#5a3120", // hair shadow
  g: "#9a6238", // hair highlight
  s: "#c68a5e", // skin
  S: "#a96e46", // skin shadow
  e: "#2e1b16", // eyes
  w: "#fff6ec", // eye shine
  r: "#8f4a3c", // mouth
  m: "#8e2b45", // shirt maroon
  M: "#6c1f34", // shirt shadow
  l: "#2a2522", // lanyard
  b: "#4a443f", // badge clip
  B: "#ece4d6", // badge face
  p: "#ead9bd", // pants
  P: "#cdbb9c", // pants shadow
  f: "#f7f0e3", // shoe upper
  F: "#bf9166", // sole
  W: "#fdfaf4", // cup lid / band
  c: "#cd8f55", // cup body
  y: "#ffc46b", // gold star
  x: "#ff8a5c", // ember bug
  R: "#e85d5d", // heart
};

const HEAD = [
  "............oooooooo............",
  "..........oohhhhhhhhoo..........",
  ".........ohhhhhhhhhhhho.........",
  "........ohhhhhhhhhhhhhho........",
  ".......ohhghhhhhhhhhhghho.......",
  "......ohhghhhhhhhhhhhhghho......",
  ".....ohhhhhhhhhhhhhhhhhhhho.....",
  ".....ohghhhhsssssssshhhhgho.....",
  ".....ohhhhhsssssssssshhhhho.....",
  ".....ohhhhhsHHssssHHshhhhho.....",
  ".....ohghhhsssssssssshhhgho.....",
  ".....ohhhhhseesssseeshhhhho.....",
  ".....ohhhhhswessssweshhhhho.....",
  ".....ohhhhhsSssssssSshhhhho.....",
  "....ohhhhhhssssrrsssshhhhhho....",
  "....ohghhhhSssssssssShhhhgho....",
  "....ohhhhho..osssso..ohhhhho....",
  "....ohhhho.ommssssmmo.ohhhho....",
];

const TORSO = [
  "...ohhhoommmmmssssmmmmmoohhho...",
  "..ooooo.ommmmlmmmmlmmmmo........",
  "..oWWWo.ommmmlmmmmlmmmmo........",
  "..occcommmmmmlmmmmlmmmmo........",
  "..occcommmmmmmmbbmmmmmmo........",
  "..occcosmmmmmmBBBBmmmmmo........",
  "..oWWWosmmmmmmBBBBmmmmmo........",
  "...ooo..oMMMMMMMMMMMMMMo........",
];

const LEGS_IDLE = [
  "........oppppppppppppppo........",
  "........oppppppppppppppo........",
  "........opppPppppppPpppo........",
  "........opppPppppppPpppo........",
  "........oppppppooppppppo........",
  "........opppppo..opppppo........",
  "........opppppo..opppppo........",
  ".......oppppppo..oppppppo.......",
  ".......oppPpppo..opppPppo.......",
  "......opppppppo..opppppppo......",
  "......opppppppo..opppppppo......",
  "......oPPPPPPPo..oPPPPPPPo......",
  "......offfffffo..offfffffo......",
  "......offfffffo..offfffffo......",
  ".....offffffffo..offffffffo.....",
  ".....oFFFFFFFFo..oFFFFFFFFo.....",
  ".....oFFFFFFFFo..oFFFFFFFFo.....",
  ".....oooooooooo..oooooooooo.....",
];

const LEGS_WALK_A = [
  "........oppppppppppppppo........",
  "........oppppppppppppppo........",
  "........opppPppppppPpppo........",
  "........opppPppppppPpppo........",
  "........oppppppooppppppo........",
  "........opppppo..opppppo........",
  "........opppppo..opppppo........",
  ".......oppppppo..oppppppo.......",
  ".......offffffo..oppppppo.......",
  "......offfffffo..opppppppo......",
  "......oFFFFFFFo..opppppppo......",
  ".................oPPPPPPPo......",
  ".................offfffffo......",
  ".................offfffffo......",
  "................offffffffo......",
  "................oFFFFFFFFo......",
  "................oFFFFFFFFo......",
  "................oooooooooo......",
];

const LEGS_WALK_B = [
  "........oppppppppppppppo........",
  "........oppppppppppppppo........",
  "........opppPppppppPpppo........",
  "........opppPppppppPpppo........",
  "........oppppppooppppppo........",
  "........opppppo..opppppo........",
  "........opppppo..opppppo........",
  ".......oppppppo..oppppppo.......",
  ".......oppppppo..offffffo.......",
  "......opppppppo..offfffffo......",
  "......opppppppo..oFFFFFFFo......",
  "......oPPPPPPPo.................",
  "......offfffffo.................",
  "......offfffffo.................",
  "......offffffffo................",
  "......oFFFFFFFFo................",
  "......oFFFFFFFFo................",
  "......oooooooooo................",
];

export type Frame = string[];

export const IDLE: Frame = [...HEAD, ...TORSO, ...LEGS_IDLE];
export const WALK_A: Frame = [...HEAD, ...TORSO, ...LEGS_WALK_A];
export const WALK_B: Frame = [...HEAD, ...TORSO, ...LEGS_WALK_B];

/** Eyes closed — doubles as a happy face while sipping coffee. */
export const BLINK: Frame = IDLE.map((row, i) => {
  if (i === 11) return ".....ohhhhhsssssssssshhhhho.....";
  if (i === 12) return ".....ohhhhhseesssseeshhhhho.....";
  return row;
});

/** Free arm raised, pointing — used when she comments on a section. */
export const POINT: Frame = IDLE.map((row, i) => {
  if (i === 19) return "..ooooo.ommmmlmmmmlmmmmoooo.....";
  if (i === 20) return "..oWWWo.ommmmlmmmmlmmmmmmsso....";
  if (i === 21) return "..occcommmmmmlmmmmlmmmmoooo.....";
  return row;
});

export const CHAR_W = 32;
export const CHAR_H = 44;

// ── Mini-game item sprites ─────────────────────────────────────
export const ITEM_CUP: Frame = [
  "..oooooo..",
  ".oWWWWWWo.",
  ".occcccco.",
  ".occcccco.",
  ".oWWWWWWo.",
  ".occcccco.",
  "..oooooo..",
];

export const ITEM_STAR: Frame = [
  "....y....",
  "....y....",
  "...yyy...",
  "yyyyyyyyy",
  "...yyy...",
  "....y....",
  "....y....",
];

export const ITEM_BUG: Frame = [
  "...oooo...",
  "..oxxxxo..",
  ".oxxxxxxo.",
  ".oxxxxxxo.",
  "..oxxxxo..",
  ".o.o..o.o.",
];

export const ITEM_HEART: Frame = [
  ".RR.RR.",
  "RRRRRRR",
  "RRRRRRR",
  ".RRRRR.",
  "..RRR..",
  "...R...",
];

// ── Rendering ──────────────────────────────────────────────────
const cache = new WeakMap<Frame, HTMLCanvasElement>();

/** Rasterize a frame once at 1px-per-cell; scaling happens at draw time. */
function rasterize(frame: Frame): HTMLCanvasElement {
  const hit = cache.get(frame);
  if (hit) return hit;
  const w = frame[0].length;
  const h = frame.length;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  frame.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const key = row[x];
      if (key === ".") continue;
      ctx.fillStyle = PALETTE[key];
      ctx.fillRect(x, y, 1, 1);
    }
  });
  cache.set(frame, canvas);
  return canvas;
}

/** Draw a frame at (x, y) top-left, scaled, optionally mirrored. */
export function drawSprite(
  ctx: CanvasRenderingContext2D,
  frame: Frame,
  x: number,
  y: number,
  scale: number,
  flip = false
) {
  const raster = rasterize(frame);
  const w = raster.width * scale;
  const h = raster.height * scale;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  if (flip) {
    ctx.translate(x + w, y);
    ctx.scale(-1, 1);
    ctx.drawImage(raster, 0, 0, w, h);
  } else {
    ctx.drawImage(raster, x, y, w, h);
  }
  ctx.restore();
}
