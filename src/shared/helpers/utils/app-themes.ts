import { link } from "node:fs";


export const light: any = {
    fontFamily: 'NotoSans',
    primaryShade: { light: 5, dark: 9 },
    colorScheme: 'light',
    white: '#FFFFFF',
    black: '#000000',

    colors: {
        backg: [
            "#F5F5F5",//light bg
        ],
        foreg: [
            "#FFFFFF",//light panels
        ],
        header: [
            "#f9efff",//light header color
        ],
        leftmenu: [
            "#FEFBFB",//light left menu color
        ],
        lightdefault: [
            "#f9efff",
            "#ebdef4",
            "#d2bbe1",
            "#b797ce",
            "#a177be",
            "#9363b4",
            "#8c59b0",
            "#7a499b",
            "#6c408b",
            "#5e357c"
        ],
        actionButton: [
            "#eaf6ff",
            "#dbe7f4",
            "#b9cce1",
            "#94b0d0",
            "#7498c0",
            "#6089b7",
            "#5582b4",
            "#446f9e",
            "#396390",
            "#285680"
          ],
        secondaryButton: [
            "#ffebf9",
            "#fad6ea",
            "#f0aad1",
            "#e77cb8",
            "#df55a1",
            "#db3d95",
            "#da2f8e",
            "#c2217a",
            "#ae1a6d",
            "#990a5e"
          ],
    },
    primaryColor: 'lightdefault',
};
export const dark: any = {
    fontFamily: 'NotoSans',
    primaryShade: { light: 5, dark: 9 },
    colorScheme: 'dark',
    white: '#FFFFFF',
    black: '#000000',

    colors: {
        backg: [
            "#141517",//light bg
        ],
        foreg: [
            "#000000",//light panels
        ],
        header: [
            "#25262b",//light header color
        ],
        leftmenu: [
            "#141517",//light left menu color
        ],
        darkdefault: [
            "#f9efff",
            "#ebdef4",
            "#d2bbe1",
            "#b797ce",
            "#a177be",
            "#9363b4",
            "#8c59b0",
            "#7a499b",
            "#6c408b",
            "#5e357c"
        ],
        actionButton: [
            "#e7f1ff",
            "#d0dfff",
            "#a0bdfc",
            "#6d98f6",
            "#4379f2",
            "#2765f0",
            "#145bf0",
            "#024cd6",
            "#0043c0",
            "#0039ab"
          ],
        secondaryButton: [
            "#ffe8ff",
            "#ffcff6",
            "#ff9bea",
            "#ff64dc",
            "#fe38d1",
            "#fe1ccb",
            "#ff09c8",
            "#e400b0",
            "#cb009d",
            "#b20089"
          ],
    },
    primaryColor: 'darkdefault',
};
export const oceanblue: any = {
    fontFamily: 'OpenSans',
    primaryShade: { light: 5, dark: 9 },
    colorScheme: 'light',
    white: '#FFFFFF',
    black: '#000000',
    defaultRadius: 10,
    colors: {
        backg: [
            "#fff4e4",//light bg
        ],
        foreg: [
            "#e4fdfb",//light panels
        ],
        header: [
            "#d7f0f3",//light header color
        ],
        leftmenu: [
            "#eefcea",//light left menu color
        ],
        oceanblue: [
            "#e2fdff",
            "#cff8fc",
            "#a3eef7",
            "#73e4f2",
            "#4fdbef",
            "#39d5ec",
            "#27d4eb",
            "#11bbd2",
            "#00a7bb",
            "#0091a4"
        ],
        actionButton: [
            "#ecfde9",
            "#ddf6d7",
            "#bceab0",
            "#98de85",
            "#7ad461",
            "#66ce4a",
            "#5bcb3d",
            "#4bb32f",
            "#3f9f27",
            "#318a1b"
        ],
        secondaryButton:[
            "#fdfee4",
            "#fbf9d0",
            "#f7f3a3",
            "#f3ed72",
            "#f0e749",
            "#ede330",
            "#ece220",
            "#d1c811",
            "#bab103",
            "#a09900"
          ],
    },
    primaryColor: 'oceanblue',
};
export const haloweenorange: any = {
    fontFamily: 'Exo',
    colorScheme: 'dark',
    white: '#FFFFFF',
    black: '#000000',
    focusRing: 'always',
    defaultRadius: 6,
    primaryShade: { light: 5, dark: 5 },
    fontSizes: { xs: '1rem', sm: '1.15rem', md: '1.35rem', lg: '1.5rem', xl: '1.65rem' },
    colors: {
        backg: [
            "#212616"
        ],
        foreg: [
            "#160D02"
        ],
        header: [
            "#5D2C00",//dark header color
        ],
        leftmenu: [
            "#291300",//dark left menu color
        ],
        'haloweenorange': [
            "#fff4e2",
            "#ffe9cc",
            "#ffd09b",
            "#ffb664",
            "#fea038",
            "#fe921b",
            "#ff8b09",
            "#e47800",
            "#ca6a00",
            "#b05a00"
        ],
        dark: ['#C1C2C5', '#A6A7AB', '#909296', '#5c5f66', '#373A40',
            '#271808',
            '#191A17',
            '#1A1B1E', '#141517', '#101113'],
        blue: [
            "#E0E6EB",
            "#C4D1DD",
            "#A8BFD3",
            "#8BAFCE",
            "#6BA0CF",
            "#4793D6",
            "#1E88E5",
            "#2B79BE",
            "#346C9E",
            "#386185",
        ],
        actionButton: [
            "#ffece6",
            "#ffd8d0",
            "#fbb1a0",
            "#f6876d",
            "#f26442",
            "#f04d27",
            "#f04118",
            "#d6320b",
            "#c02a07",
            "#a71f02"
          ],
        secondaryButton: [
            "#f5f5f5",
            "#e7e7e7",
            "#cdcdcd",
            "#b2b2b2",
            "#9a9a9a",
            "#8b8b8b",
            "#848484",
            "#717171",
            "#656565",
            "#575757"
          ],

    },
    primaryColor: `haloweenorange`,
};
export const pastelBlue: any = {
    fontFamily: 'OpenSans',
    colorScheme: 'light',
    white: '#F9F9F9',
    black: '#25272B',
    focusRing: 'auto',
    primaryShade: { light: 5, dark: 5 },
    colors: {
        backg: [
            "#F3F8FF",//light bg
        ],
        foreg: [
            "#FDFEFF",//light panels
        ],
        header: [
            "#D2E6FF",//light header color
        ],
        leftmenu: [
            "#e8edf3",//light left menu color
        ],
        'pastelBlue': [
            "#EBEFFB",
            "#C9D5F4",
            "#AABDEF",
            "#8EA7E9",
            "#7291E3",
            "#587DDE",
            "#416BDA",
            "#2B5AD6",
            "#2651C4",
            "#234AB2"
        ],

        dark: ['#C1C2C5', '#A6A7AB', '#909296', '#5c5f66', '#373A40',
            '#271808',
            '#191A17',
            '#1A1B1E', '#141517', '#101113'],
        blue: [
            "#E0E6EB",
            "#C4D1DD",
            "#A8BFD3",
            "#8BAFCE",
            "#6BA0CF",
            "#4793D6",
            "#1E88E5",
            "#2B79BE",
            "#346C9E",
            "#386185",
        ],
        actionButton: [
            "#eefaec",
            "#e0efdd",
            "#c2dcbd",
            "#a2c99b",
            "#86b87d",
            "#74ae6a",
            "#6ba95f",
            "#59934f",
            "#4d8444",
            "#3f7237"
          ],
        secondaryButton: [
            "#fff1e6",
            "#fae3d3",
            "#f0c6aa",
            "#e6a67d",
            "#de8b57",
            "#d97a3e",
            "#d87230",
            "#c06123",
            "#ab551c",
            "#964713"
          ],
    },
    primaryColor: `pastelBlue`,
};
export const pastelindigo: any = {
    fontFamily: 'OpenSans',
    primaryShade: { light: 5, dark: 9 },
    colorScheme: 'light',
    white: '#FFFFFF',
    black: '#000000',

    colors: {
        backg: [
            "#e3fbff",//light bg
        ],
        foreg: [
            "#FFFFFF",//light panels
        ],
        header: [
            "#d7f0f3",//light header color
        ],
        leftmenu: [
            "#FEFBFB",//light left menu color
        ],
        pastelindigo: [
            "#e3fbff",
            "#d7f0f3",
            "#b7dce1",
            "#93c8cf",
            "#75b7c0",
            "#61acb6",
            "#53a7b3",
            "#41939d",
            "#32828d",
            "#19717c"
        ],
        actionButton: [
            "#e5fdf4",
            "#d7f5e8",
            "#b2e7d0",
            "#8ad8b7",
            "#69cca1",
            "#53c493",
            "#45c08d",
            "#35a978",
            "#28976a",
            "#11835a"
          ],
        secondaryButton: [
            "#ebf5ff",
            "#dee6f3",
            "#becbdd",
            "#9caec7",
            "#8096b5",
            "#6d87aa",
            "#637fa5",
            "#526d91",
            "#466084",
            "#375377"
          ],
    },
    primaryColor: 'pastelindigo',
};
export const defaultLight: any = {
    fontFamily: 'NotoSans',
    primaryShade: { light: 5, dark: 9 },
    colorScheme: 'light',
    white: '#FFFFFF',
    black: '#000000',

    colors: {
        backg: [
            "#F5F5F5",//light bg
        ],
        foreg: [
            "#FFFFFF",//light panels
        ],
        header: [
            "#F8EDED",//light header color
        ],
        leftmenu: [
            "#FEFBFB",//light left menu color
        ],
        palered: [
            "#ffeaf3",
            "#fdd4e1",
            "#f4a7bf",
            "#ec779c",
            "#e64f7e",
            "#e3356b",
            "#e22762",
            "#c91a52",
            "#b41149",
            "#9f003e"
        ],
        actionButton: [
            "#f1ebff",
            "#dcd3fe",
            "#b7a2f8",
            "#8e6ff4",
            "#6d44ef",
            "#5829ed",
            "#4d1bed",
            "#3e0fd4",
            "#360cbe",
            "#2b07a8"
          ],
        secondaryButton: [
            "#e3fbfb",
            "#d8f1f1",
            "#b9dedf",
            "#96cacc",
            "#78babc",
            "#65b0b2",
            "#58abad",
            "#459799",
            "#378689",
            "#1f7477"
          ],
    },
    primaryColor: 'palered',
};
export const lemonade: any = {
    fontFamily: 'NotoSans',
    primaryShade: { light: 5, dark: 9 },
    colorScheme: 'light',
    white: '#FFFFFF',
    black: '#000000',

    colors: {
        backg: [
            "#FEF9D9",//light bg
        ],
        foreg: [
            "#FFFFFF",//light panels
        ],
        header: [
            "#E4F6D6",//light header color
        ],
        leftmenu: [
            "#F1F5EE",//light left menu color
        ],
        lemonade: [
            "#FDFFFB",
            "#C3FF81",
            "#95FF1E",
            "#6FFF00",
            "#58FF00",
            "#4CAD00",
            "#36A400",
            "#297D00",
            "#1F5F00",
            "#184800",
        ],
        actionButton:[
            "#fffee2",
            "#fefacd",
            "#fcf59e",
            "#faf069",
            "#f9ec3e",
            "#f8e923",
            "#f8e711",
            "#dccd00",
            "#c3b600",
            "#a89d00"
          ],
        secondaryButton: [
            "#fcf4ee",
            "#f3e6dd",
            "#e8cab4",
            "#dfac87",
            "#d69261",
            "#d2824a",
            "#d17a3c",
            "#b8682f",
            "#a55c28",
            "#904e1e"
          ],


    },
    primaryColor: 'lemonade',
};
export const coffee: any = {
    fontFamily: 'NotoSans',
    primaryShade: { light: 5, dark: 9 },
    colorScheme: 'dark',
    white: '#FFFFFF',
    black: '#000000',

    colors: {
        backg: [
            "#2E222D",//light bg
        ],
        foreg: [
            "#20181F",//light panels
        ],
        header: [
            "#382936",//light header color
        ],
        leftmenu: [
            "#2E222D",//light left menu color
        ],
        dark: [
            "#C1C2C5",
            "#A6A7AB",
            "#909296",
            "#5c5f66",
            "#373A40",
            "#2C2E33",
            "#25262b",
            "#1A1B1E",
            "#141517",
            "#101113"
        ],
        coffee: [
            "#FFF7E5",
            "#FFD898",
            "#ECB967",
            "#D29E48",
            "#AD833E",
            "#976C25",
            "#855911",
            "#784B01",
            "#6D3F00",
            "#583200",
        ],
        actionButton: [
            "#fff4e3",
            "#fbe6d2",
            "#f0cda9",
            "#e6b17d",
            "#dd9957",
            "#d88a3e",
            "#d78331",
            "#be6f23",
            "#aa631c",
            "#955410"
          ],
        secondaryButton: [
            "#ebf5ff",
            "#dee6f3",
            "#becbdd",
            "#9caec7",
            "#8096b5",
            "#6d87aa",
            "#637fa5",
            "#526d91",
            "#466084",
            "#375377"
          ],
    },
    primaryColor: 'coffee',
};
export const valentine: any = {
    fontFamily: 'NotoSans',
    primaryShade: { light: 5, dark: 9 },
    colorScheme: 'light',
    white: '#FFFFFF',
    black: '#632c3b',
    fontSizes: { xs: '0.9rem', sm: '1rem', md: '1.15rem', lg: '1.25rem', xl: '1.40rem' },
    colors: {
        backg: [
            "#fae7f4",//light bg
        ],
        foreg: [
            "#f7f0f5",//light panels
        ],
        header: [
            "#FFC0DE",//light header color
        ],
        leftmenu: [
            "#fae7f4",//light left menu color
        ],
        valentine: [
            "#FFC0DE",
            "#FF88C0",
            "#FF57A6",
            "#FF3891",
            "#F33A84",
            "#D13F79",
            "#AF4670",
            "#B02A60",
            "#B70B50",
            "#C50040",
        ],
        actionButton: [
            "#ffedf6",
            "#f4dce6",
            "#e3b8c9",
            "#d292ab",
            "#c37092",
            "#bb5b82",
            "#b8507a",
            "#a24168",
            "#92385c",
            "#812d4f"
          ],
        secondaryButton: [
            "#e3fbfb",
            "#d8f1f1",
            "#b9dedf",
            "#96cacc",
            "#78babc",
            "#65b0b2",
            "#58abad",
            "#459799",
            "#378689",
            "#1f7477"
          ],
    },
    primaryColor: 'valentine',
};
export const aqua: any = {
    fontFamily: 'NotoSans',
    primaryShade: { light: 5, dark: 9 },
    colorScheme: 'dark',
    white: '#FFFFFF',
    black: '#000000',
    focusRing: 'always',
    fontSizes: { xs: '0.9rem', sm: '1rem', md: '1.15rem', lg: '1.25rem', xl: '1.40rem' },
    colors: {
        backg: [
            "#345da7",//light bg
        ],
        foreg: [
            "#204993",//light panels
        ],
        header: [
            "#966fb3",//light header color
        ],
        leftmenu: [
            "#345da7",//light left menu color
        ],
        dark: [
            "#DBE9FF",
            "#8AB8FF",
            "#ADE5FF",
            "#87C6E4",
            "#195FDE",
            "#2455AD",
            "#294B88",
            "#193B78",
            "#0C2E6B",
            "#012360",
        ],
        aqua: [
            "#DEFFFF",
            "#93FFFF",
            "#52FFFF",
            "#19FFFF",
            "#00FFFF",
            "#08ECF3",
            "#00FAFF",
            "#00E0E8",
            "#00C0C8",
            "#00A5AC",
        ],
        blue: [
            "#F2FBFF",
            "#E4F6FF",
            "#DEF5FF",
            "#BBE9FF",
            "#95DEFF",
            "#74D4FF",
            "#55CBFF",
            "#39C2FF",
            "#1FBAFF",
            "#07B3FF",

        ],
        green: [
            "#55F970",
            "#5DEE75",
            "#63E479",
            "#69DB7C",
            "#5EE374",
            "#51ED6B",
            "#42F860",
            "#31FF55",
            "#26FF4D",
            "#23FF4A"
        ],
        yellow: [
            "#FFFCED",
            "#FFF5BC",
            "#FFE999",
            "#FFE862",
            "#FFE23A",
            "#FFDD15",
            "#FFD900",
            "#FFCB00",
            "#EFB600",
            "#EFB600"
        ],
        actionButton: [
            "#fff4e3",
            "#fbe6d2",
            "#f0cda9",
            "#e6b17d",
            "#dd9957",
            "#d88a3e",
            "#d78331",
            "#be6f23",
            "#aa631c",
            "#955410"
          ],
        secondaryButton:[
            "#e5f8ff",
            "#d7eaf8",
            "#b2d1e9",
            "#88b8db",
            "#66a3cf",
            "#4f95c9",
            "#428ec6",
            "#327baf",
            "#266d9f",
            "#095f8d"
          ],
    },
    primaryColor: 'aqua',
};
export const dracula: any = {
    fontFamily: 'NotoSans',
    primaryShade: { light: 5, dark: 8 },
    colorScheme: 'dark',
    white: '#FFFFFF',
    black: '#000000',

    colors: {
        backg: [
            "#282a36",//light bg
        ],
        foreg: [
            "#20222B",//light panels
        ],
        header: [
            "#1C1D26",//light header color
        ],
        leftmenu: [
            "#282a36",//light left menu color
        ],
        dark: [
            "#C1C2C5",
            "#A6A7AB",
            "#909296",
            "#5c5f66",
            "#373A40",
            "#2C2E33",
            "#25262b",
            "#1A1B1E",
            "#141517",
            "#101113"
        ],
        green: [
            "#e2ffeb",
            "#cdffd9",
            "#9bfdb5",
            "#67fb8d",
            "#3bf96b",
            "#1ef956",
            "#03f84a",
            "#00dd3a",
            "#00c531",
            "#00aa23"
        ],
        dracula: [
            "#ffe8f9",
            "#ffcfec",
            "#ff9bd5",
            "#ff64bd",
            "#fe38a9",
            "#fe1c9d",
            "#ff0996",
            "#e40082",
            "#cc0074",
            "#b30065"
        ],
        actionButton: [
            "#ffe8f9",
            "#ffcfec",
            "#ff9bd5",
            "#ff64bd",
            "#fe38a9",
            "#fe1c9d",
            "#ff0996",
            "#e40082",
            "#cc0074",
            "#b30065"
          ],
        secondaryButton: [
            "#fff4e2",
            "#ffe7cc",
            "#ffcf9b",
            "#ffb464",
            "#fe9e38",
            "#fe8f1b",
            "#ff8809",
            "#e47500",
            "#cb6700",
            "#b05800"
          ],
    },
    primaryColor: 'dracula',
};
export const bnw: any = {
    fontFamily: 'Montserrat',
    primaryShade: { light: 6, dark: 9 },
    colorScheme: 'light',
    white: '#FFFFFF',
    black: '#000000',

    colors: {
        backg: [
            "#e7e7ec",//light bg
        ],
        foreg: [
            "#ccccd0",//light panels
        ],
        header: [
            "#b0b0b4",//light header color
        ],
        leftmenu: [
            "#d8d8d9",//light left menu color
        ],
        bnw: [
            "#fff2f5",
            "#e7e7ec",
            "#ccccd0",
            "#b0b0b4",
            "#98989c",
            "#88888e",
            "#818187",
            "#6e6e76",
            "#62626a",
            "#535361"
        ],
        red: [
            "#ffeeee",
            "#f4dedd",
            "#e1bdba",
            "#cf9894",
            "#c07a74",
            "#b7665f",
            "#b35c55",
            "#9e4c45",
            "#8e423c",
            "#7e3632"
        ],
        blue: [
            "#e7f8ff",
            "#d9e9f4",
            "#b6d1e4",
            "#90b8d4",
            "#70a3c6",
            "#5a95be",
            "#4e8ebb",
            "#3d7ba6",
            "#326d95",
            "#1d5f85"
        ],
        green: [
            "#eafbf1",
            "#dbf4e3",
            "#b5e6c5",
            "#8dd9a5",
            "#6cce8a",
            "#56c778",
            "#4ac36f",
            "#3aad5e",
            "#309952",
            "#208543"
        ],
        yellow: [
            "#fbf9eb",
            "#f3f1dc",
            "#e6e2b8",
            "#d8d290",
            "#ccc56f",
            "#c4bc59",
            "#c1b84d",
            "#a9a23d",
            "#968f33",
            "#817b26"
        ],
        orange: [
            "#fff4e3",
            "#fde9cf",
            "#f8d0a3",
            "#f2b671",
            "#eea047",
            "#ec922d",
            "#eb8b1d",
            "#d07810",
            "#ba6907",
            "#a25a00"
        ],
        actionButton: [
            "#eaf6fe",
            "#e0e8f0",
            "#c1cfd9",
            "#a0b4c3",
            "#859db1",
            "#738fa5",
            "#6788a1",
            "#56758d",
            "#49687f",
            "#395a73"
          ],
        secondaryButton: [
            "#fff4e8",
            "#f0e6de",
            "#d9cdc1",
            "#c1b1a2",
            "#ad9987",
            "#a18a76",
            "#9c836c",
            "#88705a",
            "#7b624e",
            "#6c553d"
          ],
    },
    primaryColor: 'bnw',
};
export const morningWood: any = {
    fontFamily: 'Exo',
    primaryShade: { light: 9, dark: 9 },
    colorScheme: 'light',
    white: '#FFFFFF',
    black: '#000000',

    colors: {
        backg: [
            "#f0ead2",//light bg
        ],
        foreg: [
            "#adc178",//light panels
        ],
        header: [
            "#dde5b6",//light header color
        ],
        leftmenu: [
            "#dde5b6",//light left menu color
        ],
        morningWood: [
            "#f4f9f0",
            "#e8f1e1",
            "#cee2bd",
            "#b3d397",
            "#9bc676",
            "#8cbe61",
            "#84ba56",
            "#71a346",
            "#64913d",
            "#537d30"
          ],
        actionButton: [
            "#f7f4f3",
            "#e7e7e7",
            "#cfcdcc",
            "#b7b0ac",
            "#a49892",
            "#988980",
            "#938175",
            "#806e64",
            "#726157",
            "#665347"
          ],
        secondaryButton: [
            "#fbf4ea",
            "#efe7df",
            "#d9ccc1",
            "#c3b0a0",
            "#b19784",
            "#a58872",
            "#a18167",
            "#8d6e56",
            "#7e624a",
            "#70533c"
          ],
    },
    primaryColor: 'morningWood',
};
export const havana: any = {
    fontFamily: 'NotoSans',
    primaryShade: { light: 5, dark: 9 },
    colorScheme: 'light',
    white: '#FFFFFF',
    black: '#000000',

    colors: {
        backg: [
            "#fff4e4",//light bg
        ],
        foreg: [
            "#f7ffff",//light panels
        ],
        header: [
            "#d7f0f3",//light header color
        ],
        leftmenu: [
            "#eefcea",//light left menu color
        ],
        havana: [
            "#e4fcff",
            "#d5f3f7",
            "#afe4ec",
            "#85d5e0",
            "#63c8d7",
            "#4dc0d1",
            "#3ebccf",
            "#2ca6b7",
            "#1994a4",
            "#008090"
        ],
        actionButton: [
            "#ffeefe",
            "#f5dcf2",
            "#e4b7e0",
            "#d490cd",
            "#c56fbc",
            "#bd5ab3",
            "#b94fae",
            "#a33f99",
            "#923689",
            "#812b79"
        ],
        secondaryButton: [
            "#f8ebff",
            "#ead4fd",
            "#d1a5f5",
            "#b774ef",
            "#a14aea",
            "#9430e7",
            "#8d22e6",
            "#7a16cd",
            "#6c11b8",
            "#5e08a2"
        ],
    },
    primaryColor: 'havana',
};

export const sunKissedBerries: any = {
    fontFamily: 'NotoSans',
    primaryShade: { light: 5, dark: 9 },
    colorScheme: 'light',
    white: '#FFFFFF',
    black: '#1e1220',

    colors: {
        backg: [
            "#fffbfe",//light bg
        ],
        foreg: [
            "#efeaee",//light panels
        ],
        header: [
            "#9b889c",//light header color
        ],
        leftmenu: [
            "#fff2f2",//light left menu color
        ],
        berries: [
            "#ffeaef",
            "#fcd5db",
            "#f1aab5",
            "#e87c8c",
            "#df556a",
            "#db3c54",
            "#da2e49",
            "#c1213a",
            "#ad1933",
            "#990c2a"
        ],
        actionButton: [
            "#eff2ff",
            "#dfe2f4",
            "#bdc2df",
            "#9aa1cb",
            "#7c84b9",
            "#6872af",
            "#5e69ab",
            "#4e5896",
            "#444e88",
            "#38437a"
        ],
        secondaryButton: [
            "#fcedf1",
            "#f4d8df",
            "#ebacbc",
            "#e47d97",
            "#dd5778",
            "#da4164",
            "#d9355a",
            "#c1294b",
            "#ac2142",
            "#971638"
        ],
    },
    primaryColor: 'berries',
};


export const bonfire: any = {
    fontFamily: 'NotoSans',
    primaryShade: { light: 5, dark: 9 },
    colorScheme: 'light',
    white: '#FFFFFF',
    black: '#0e0f2e',

    colors: {
        backg: [
            "#fffbfe",//light bg
        ],
        foreg: [
            "#dbe3e6",//light panels
        ],
        header: [
            "#dbe3e6",//light header color
        ],
        leftmenu: [
            "#f7f7f7",//light left menu color
        ],
        bonfire: [
            "#ffefe4",
            "#ffddce",
            "#ffb99c",
            "#fd9366",
            "#fd7239",
            "#fd5e1c",
            "#fd530d",
            "#e24301",
            "#ca3a00",
            "#b02f00"
        ],
        actionButton: [
            "#fff0e4",
            "#fde0d2",
            "#f3c1a7",
            "#ea9f79",
            "#e38252",
            "#df7038",
            "#dd662a",
            "#c4551d",
            "#b04b17",
            "#9a3e0e"
        ],
        secondaryButton: [
            "#f1f4f9",
            "#e2e5ea",
            "#c0c9d7",
            "#9cabc5",
            "#7d92b5",
            "#6a82ab",
            "#5f7aa8",
            "#4f6893",
            "#455c85",
            "#375076"
        ],
    },
    primaryColor: 'bonfire',
};


export const watermelonSorbet: any = {
    fontFamily: 'NotoSans',
    primaryShade: { light: 5, dark: 9 },
    colorScheme: 'light',
    white: '#FFFFFF',
    black: '#0e0f2e',

    colors: {
        backg: [
            "#f8f6f7",//light bg
        ],
        foreg: [
            "#ffe1df",//light panels
        ],
        header: [
            "#fea59d",//light header color
        ],
        leftmenu: [
            "#ffe1df",//light left menu color
        ],
        watermelonSorbet: [
            "#ffe7e8",
            "#ffcecf",
            "#ff9c9d",
            "#fe6568",
            "#fd383a",
            "#fd1c1d",
            "#fd0b0e",
            "#e20003",
            "#ca0001",
            "#b10000"
        ],
        actionButton: [
            "#e6fdf3",
            "#d7f5e8",
            "#b1e8d1",
            "#89dbb8",
            "#67d0a2",
            "#50c995",
            "#43c58d",
            "#32ae7a",
            "#269b6b",
            "#0f865a"
        ],
        secondaryButton: ["#f7f3f2",
            "#e8e6e5",
            "#d2c9c6",
            "#bdaaa4",
            "#ab9087",
            "#a17f74",
            "#9d766a",
            "#896459",
            "#7b594e",
            "#6d4b40"
        ],
    },
    primaryColor: 'watermelonSorbet',
};


export const littlePlanet: any = {
    fontFamily: 'NotoSans',
    primaryShade: { light: 5, dark: 9 },
    colorScheme: 'dark',
    white: '#e0fbfc',
    black: '#293241',

    colors: {
        backg: [
            "#293241",//light bg
        ],
        foreg: [
            "#202a37",//light panels
        ],
        header: [
            "#0f1b2b",//light header color
        ],
        leftmenu: [
            "#202a37",//light left menu color
        ],
        littlePlanet: [
            "#ffece6",
            "#ffdad0",
            "#f9b3a3",
            "#f28a71",
            "#ed6747",
            "#eb512c",
            "#ea451e",
            "#d13611",
            "#bb2e0d",
            "#a32306"
        ],
        actionButton: [
            "#ffece6",
            "#ffdad0",
            "#f9b3a3",
            "#f28a71",
            "#ed6747",
            "#eb512c",
            "#ea451e",
            "#d13611",
            "#bb2e0d",
            "#a32306"
        ],
        secondaryButton: [
            "#e6f8ff",
            "#d8ebf6",
            "#b5d4e5",
            "#8ebbd5",
            "#6ea6c8",
            "#5999c0",
            "#4b93bd",
            "#3a7fa7",
            "#2e7197",
            "#166286"
        ],
    },
    primaryColor: 'littlePlanet',
};
export const systemAppThemes = [
    {key:'LIGHT', value: light},
    {key:'DARK', value: dark},
    {key:'PALE RED', value: defaultLight},
    {key:'PASTEL BLUE', value: pastelBlue},
    {key:'PASTEL INDIGO', value: pastelindigo},
    {key:'OCEAN BLUE', value: oceanblue},
    {key:'HALOWEEN', value:haloweenorange},
    {key:'LEMONADE', value: lemonade},
    {key:'COFFEE', value: coffee},
    {key:'VALENTINE', value: valentine},
    {key:'AQUA', value: aqua},
    {key:'DRACULA', value: dracula},
    {key:'BNW', value: bnw},
    {key:'MORNING WOOD', value: morningWood},
    {key:'HAVANA', value: havana},
    {key:'SUN KISSED BERRIES', value: sunKissedBerries},
    {key:'BONFIRE', value: bonfire},
    {key:'WATERMELON SORBET', value: watermelonSorbet},
    {key:'LITTLE PLANET', value: littlePlanet},
]
