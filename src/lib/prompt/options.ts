export type Option = { id: string; label: string; fragment: string }

export const LOCATIONS: Option[] = [
  { id: 'diner', label: 'Retro Diner', fragment:
    'inside a chrome-trimmed 1950s-style diner, red vinyl booths, black-and-white checkered floor, buzzing neon "OPEN" sign, ketchup bottles on the table' },
  { id: 'neon_street', label: 'Neon Street', fragment:
    'on a rain-slicked downtown street at night, glowing magenta and cyan neon signage, wet asphalt reflecting the lights, steam rising from a grate' },
  { id: 'beach', label: 'Beach Sunset', fragment:
    'on a palm-lined beach at golden hour, hazy gradient sunset sky, gentle surf, distant lifeguard tower' },
  { id: 'studio', label: 'Photo Studio', fragment:
    'in a professional photo studio, pastel seamless backdrop, large softbox key light with subtle rim light' },
]

export const FASHION: Option[] = [
  { id: 'newwave', label: 'New Wave', fragment:
    'wearing 1980s New Wave fashion - oversized boxy blazers, skinny ties, bold geometric prints, heavy eyeliner, teased hair' },
  { id: 'aerobics', label: 'Aerobics', fragment:
    'wearing 1980s aerobics fashion - neon leotards, leg warmers, sweatbands, high-cut workout gear, scrunchies' },
  { id: 'preppy', label: 'Preppy', fragment:
    'wearing 1980s preppy fashion - pastel polo shirts with popped collars, cable-knit sweaters tied over the shoulders, pleated khakis' },
  { id: 'punk', label: 'Punk / Rock', fragment:
    'wearing 1980s punk-rock fashion - distressed leather jackets, studded denim, band tees, ripped jeans, chunky boots' },
  { id: 'prom', label: 'Prom Night', fragment:
    'wearing 1980s prom formalwear - taffeta ruffled gown with puffed sleeves and a powder-blue tuxedo with a ruffled shirt' },
]

export const CAMERAS: Option[] = [
  { id: 'portra', label: 'Kodak Portra 400', fragment:
    'shot on Kodak Portra 400, warm natural skin tones, fine organic grain, soft highlight roll-off' },
  { id: 'polaroid', label: 'Polaroid 600', fragment:
    'shot on Polaroid 600 instant film, soft focus, slightly washed color shift, subtle vignette, instant-frame border' },
  { id: 'grain35', label: '35mm Grain', fragment:
    'shot on 35mm film stock, heavy visible grain, halation blooming around highlights, slightly muted vintage colors' },
]

export type Target = 'midjourney' | 'sdxl' | 'flux'

export type PromptInput = {
  locationId: string
  fashionId: string
  cameraId: string
  detail?: string
}

export type PromptResult = Record<Target, string> & { negative: string }

export const NEGATIVE =
  'modern clothing, smartphones, contemporary cars, wrong-era objects, watermark, text, logo, signature, ' +
  'extra fingers, deformed hands, plastic skin, oversaturated, low resolution, blurry, jpeg artifacts, cartoon'

const byId = (list: Option[], id: string) => list.find((o) => o.id === id) ?? list[0]

export function buildPrompt({ locationId, fashionId, cameraId, detail }: PromptInput): PromptResult {
  const loc     = byId(LOCATIONS, locationId)
  const fashion = byId(FASHION, fashionId)
  const cam     = byId(CAMERAS, cameraId)

  const subject =
    'a young couple deeply in love, mid-20s, candid natural pose, relaxed body language, looking at the camera'
  const extra = detail?.trim() ? ', ' + detail.trim() : ''

  const core = [
    '1980s retro editorial couple portrait',
    subject,
    loc.fragment,
    fashion.fragment + extra,
    cam.fragment,
    'cinematic composition, nostalgic color grading, authentic period-accurate props',
    'shallow depth of field, photorealistic, ultra-detailed, 8k',
  ].join(', ')

  return {
    midjourney: core + ' --ar 4:5 --style raw --stylize 250 --v 6.1',
    sdxl: core + '\n\nNegative prompt: ' + NEGATIVE,
    flux: core,
    negative: NEGATIVE,
  }
}

export function randomSelection() {
  const pick = (list: Option[]) => list[Math.floor(Math.random() * list.length)].id
  return { locationId: pick(LOCATIONS), fashionId: pick(FASHION), cameraId: pick(CAMERAS) }
}
