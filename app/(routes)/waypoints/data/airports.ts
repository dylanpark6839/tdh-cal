import { Airport } from '../types';

export const AIRPORTS: Airport[] = [
  {
    id: "RKSI",
    name: "RKSI(인천국제공항)",
    type: "civilian",
    coordinates: {
      lat: 37.46088529249172,
      lng: 126.4407914422479
    },
    description: "<div>인천공항<br></div><div>ELEV : 23<br></div><div>RWY : 16-34<br></div><div>Call : </div>",
    frequencies: {
      atis: "128.20, 128.40, 128.65",
      approach: "119.05, 119.10, 119.75, 120.80, 121.35, 124.20, 124.70",
      tower: "118.20, 118.27, 118.80",
      ground: "121.70, 121.75, 121.87, 121.92",
      departure: "121.40, 124.80, 125.15",
      clearance: "121.60, 121.87"
    }
  },
  {
    id: "RKSS",
    name: "RKSS(김포국제공항)",
    type: "civilian",
    coordinates: {
      lat: 37.5583,
      lng: 126.7910004
    },
    description: "<div>김포공항<br></div><div>ELEV : 58<br></div><div>RWY : 14-32<br></div><div>Call : </div>",
    frequencies: {
      atis: "126.40",
      approach: "119.05, 119.75, 119.10, 119.90, 120.80, 121.35, 124.20",
      tower: "118.10, 118.05",
      ground: "121.90, 121.95",
      departure: "121.40, 124.80, 125.15",
      clearance: "121.975"
    }
  },
  {
    id: "RKPC",
    name: "RKPC(제주국제공항)",
    type: "civilian",
    coordinates: {
      lat: 33.51060175700574,
      lng: 126.4892656720073
    },
    description: "<div>제주공항<br></div><div>ELEV : 87<br></div><div>RWY : 07-25 / 13-31<br></div><div>Call :<br></div>",
    frequencies: {
      atis: "126.8, 239.5",
      approach: "121.2, 124.05, 119.0, 317.7, 279.8",
      tower: "118.125, 118.2, 236.6",
      ground: "121.65",
      departure: "119.225, 317.7",
      clearance: "121.925"
    }
  },
  {
    id: "RKNY",
    name: "RKNY(양양국제공항)",
    type: "civilian",
    coordinates: {
      lat: 38.061333,
      lng: 128.669167
    },
    description: "<div>양양국제공항<br></div><div>ELEV : 73<br></div><div>RWY : 15/33<br></div><div>Call : </div>",
    frequencies: {
      atis: "128.82",
      approach: "124.60, 304.00",
      tower: "118.85, 124.37, 240.40",
      ground: "124.30, 240.40",
      clearance: "124.30, 240.40",
      departure: "124.60, 258.40",
      emergency: "121.50, 243.00"
    }
  },
  {
    id: "RKJB",
    name: "RKJB(무안국제공항)",
    type: "civilian",
    coordinates: {
      lat: 34.991333,
      lng: 126.382833
    },
    description: "<div>무안국제공항<br></div><div>ELEV : 52<br></div><div>RWY : 01-19<br></div><div>Call : </div>",
    frequencies: {
      atis: "127.42",
      approach: "120.47, 130.0, 228.9, 265.5, 319.2",
      tower: "118.25, 118.85",
      ground: "121.7, 317.45",
      departure: "124.0, 124.7, 347.2",
      clearance: "121.7"
    }
  },
  {
    id: "RKTL",
    name: "RKTL(울진공항)",
    type: "civilian",
    coordinates: {
      lat: 36.778700,
      lng: 129.465376
    },
    description: "<div>울진공항<br></div><div>ELEV : 50<br></div><div>RWY : 07-25<br></div><div>Call : </div>",
    frequencies: {
      atis: "127.4",
      approach: "124.25, 120.2, 232.4",
      tower: "118.05",
      ground: "121.75",
      departure: "124.25",
      clearance: "121.75"
    }
  },
  {
    id: "RKPU",
    name: "RKPU(울산공항)",
    type: "civilian",
    coordinates: {
      lat: 35.5933,
      lng: 129.3517
    },
    description: "<div>울산공항<br></div><div>ELEV : 13<br></div><div>RWY : 18-36<br></div><div>Call : </div>",
    frequencies: {
      atis: "127.625, 233.55",
      approach: "124.25, 120.2, 232.4, 119.250, 317.525",
      tower: "118.75, 236.6, 225.55",
      ground: "121.75",
      departure: "124.25, 120.2, 232.4, 119.250, 317.525",
      clearance: "121.75"
    }
  },
  {
    id: "RKJY",
    name: "RKJY(여수공항)",
    type: "civilian",
    coordinates: {
      lat: 34.8422,
      lng: 127.6172
    },
    description: "<div>여수공항<br></div><div>ELEV : 16<br></div><div>RWY : 17-35<br></div><div>Call : </div>",
    frequencies: {
      atis: "128.275",
      approach: "135.4, 119.725",
      tower: "122.5",
      ground: "118.525",
      departure: "119.725",
      clearance: "118.525"
    }
  },
  {
    id: "RKPD",
    name: "RKPD(정석공항)",
    type: "civilian",
    coordinates: {
      lat: 33.3983,
      lng: 126.7117
    },
    description: "<div>정석공항<br></div><div>ELEV : 358<br></div><div>RWY : 01-19, 15-33<br></div><div>Call : </div>",
    frequencies: {
      atis: "128.25",
      approach: "119.0, 121.2, 124.05, 279.8, 317.7",
      tower: "124.35, 239.1",
      ground: "121.95",
      departure: "119.225, 317.7",
      clearance: "121.95"
    }
  },
  {
    id: "RKSG",
    name: "A-511(평택비행장)",
    type: "army",
    coordinates: {
      lat: 36.96111155308972,
      lng: 127.0329207978921
    },
    description: "<div>평택비행장<br></div><div><br></div>",
    frequencies: {}
  },
  {
    id: "RKPK",
    name: "RKPK(김해국제공항)",
    type: "civilian",
    coordinates: {
      lat: 35.17944444444444,
      lng: 128.93666666666667
    },
    description: "<div>김해공항<br></div><div>ELEV : 13<br></div><div>RWY : 18-36<br></div><div>Call : </div>",
    frequencies: {
      atis: "126.60",
      approach: "125.50",
      tower: "118.10, 118.45",
      ground: "121.90",
      departure: "125.50",
      clearance: "121.80"
    }
  },
  {
    id: "RKTN",
    name: "RKTN(대구국제공항)",
    type: "civilian",
    coordinates: {
      lat: 35.89376,
      lng: 128.65589
    },
    description: "<div>대구공항<br></div><div>ELEV : 120<br></div><div>RWY : 13-31<br></div><div>Call : </div>",
    frequencies: {
      atis: "127.65",
      approach: "135.90",
      tower: "126.20",
      ground: "121.95",
      departure: "120.25",
      clearance: "133.75"
    }
  },
  {
    id: "RKTH",
    name: "RKTH(포항공항)",
    type: "civilian",
    coordinates: {
      lat: 35.9878998,
      lng: 129.4199982
    },
    description: "<div>포항공항<br></div><div>ELEV : 23<br></div><div>RWY : 10-28<br></div><div>Call : </div>",
    frequencies: {
      atis: "127.4, 317.375",
      approach: "124.25, 120.2, 232.4",
      tower: "118.05, 236.6, 334.6",
      ground: "126.2, 275.8",
      departure: "124.25, 120.2, 232.4",
      clearance: "126.2"
    }
  },
  {
    id: "RKPS",
    name: "RKPS(사천공항)",
    type: "civilian",
    coordinates: {
      lat: 35.0883,
      lng: 128.0705
    },
    description: "<div>사천공항<br></div><div>ELEV : 26<br></div><div>RWY : 06L/24R, 06R/24L<br></div><div>Call : </div>",
    frequencies: {
      atis: "126.225",
      approach: "135.4, 134.1, 134.4",
      tower: "126.2",
      ground: "126.2",
      departure: "135.4",
      clearance: "126.2"
    }
  },
  {
    id: "RKJK",
    name: "RKJK(군산공항)",
    type: "military",
    coordinates: {
      lat: 35.903756,
      lng: 126.615894
    },
    description: "<div>군산공항<br></div><div>ELEV : 29<br></div><div>RWY : 18-36<br></div><div>Call : </div>",
    frequencies: {
      atis: "120.225, 304.8",
      approach: "124.1, 292.65",
      tower: "126.5, 292.3",
      ground: "123.5, 273.525",
      departure: "124.1, 292.65",
      clearance: "133.75, 287.7"
    }
  },
  {
    id: "RKPE",
    name: "K-10(진해비행장)",
    type: "navy",
    coordinates: {
      lat: 35.14055936625755,
      lng: 128.6962026021734
    },
    description: "<div>진해비행장<br></div><div>ELEV : 12<br></div><div>RWY : 18-36<br></div><div>Call : 055-907-6164<br></div>",
    frequencies: {
      approach: "125.5",
      tower: "126.2",
      ground: "120.2"
    }
  },
  {
    id: "KRSW",
    name: "K-13(수원비행장)",
    type: "airforce",
    coordinates: {
      lat: 37.23941509024289,
      lng: 127.005818272257
    },
    description: "<div>수원비행장<br></div><div>ELEV : 88<br></div><div>RWY : 15-33<br></div><div>Call : 935-1271 / 031-220-1271<br></div>",
    frequencies: {
      atis: "126.425",
      approach: "127.9",
      tower: "126.2",
      ground: "275.8",
      clearance: "275.8"
    }
  },
  {
    id: "RKJM",
    name: "K-15(목포비행장)",
    type: "navy",
    coordinates: {
      lat: 34.75954027959187,
      lng: 126.3813611797665
    },
    description: "<div>목포비행장<br></div><div>ELEV : 23<br></div><div>RWY : 06-24<br></div><div>Call : 061-263-2631, 2632<br></div>",
    frequencies: {
      approach: "130.0",
      tower: "134.4",
      departure: "124.0"
    }
  },
  {
    id: "RKSM",
    name: "K-16(서울공항)",
    type: "airforce",
    coordinates: {
      lat: 37.4461,
      lng: 127.1131
    },
    description: "<div>서울공항<br></div><div>ELEV : 93<br></div><div>RWY : 01-19, 02-20<br></div><div>Call : </div>",
    frequencies: {
      atis: "126.475, 225.775",
      approach: "123.8, 363.8",
      tower: "126.2, 236.6, 292.85",
      ground: "121.85, 275.8",
      departure: "123.8, 363.8",
      clearance: "121.85"
    }
  },
  {
    id: "RKNN",
    name: "K-18(강릉비행장)",
    type: "airforce",
    coordinates: {
      lat: 37.75397618425347,
      lng: 128.9451806800886
    },
    description: "<div>강릉비행장<br></div><div>ELEV : 28<br></div><div>RWY : 26-08<br></div><div>Call : 940-3511(mil) / 033-649-3511<br></div>",
    frequencies: {
      atis: "126.675",
      approach: "124.6",
      tower: "126.2",
      ground: "275.8"
    }
  },
  {
    id: "RKNW",
    name: "RKNW(원주공항)",
    type: "military",
    coordinates: {
      lat: 37.4380989,
      lng: 127.9600983
    },
    description: "<div>원주공항<br></div><div>ELEV : 329<br></div><div>RWY : 13-31<br></div><div>Call : </div>",
    frequencies: {
      atis: "128.6",
      approach: "130.2, 134.1, 134.4",
      tower: "126.2, 118.325",
      ground: "275.8",
      departure: "130.2",
      clearance: "275.8"
    }
  },
  {
    id: "RKSO",
    name: "K-55(오산비행장)",
    type: "us_military",
    coordinates: {
      lat: 37.09050836774291,
      lng: 127.0295896584099
    },
    description: "<div>오산비행장<br></div>",
    frequencies: {
      atis: "132.125, 272.7",
      approach: "127.9, 234.3",
      tower: "122.1, 308.8",
      ground: "132.45, 253.7"
    }
  },
  {
    id: "RKJJ",
    name: "RKJJ(광주공항)",
    type: "civilian",
    coordinates: {
      lat: 35.126389,
      lng: 126.808889
    },
    description: "<div>광주공항<br></div><div>ELEV : 15<br></div><div>RWY : 04L/22R, 04R/22L<br></div><div>Call : </div>",
    frequencies: {
      atis: "128.875, 234.7",
      approach: "120.475, 130.0, 228.9, 265.5, 319.2",
      tower: "118.05, 236.6, 254.6",
      ground: "121.8, 275.8",
      departure: "124.0, 347.2",
      clearance: "121.8"
    }
  },
  {
    id: "RKTY",
    name: "K-58(예천비행장)",
    type: "airforce",
    coordinates: {
      lat: 36.63192291901573,
      lng: 128.3555085301218
    },
    description: "<div>예천비행장<br></div>",
    frequencies: {
      tower: "269.5, 236.6, 126.2",
      ground: "275.8",
      clearance: "275.8"
    }
  },
  {
    id: "RKTU",
    name: "RKTU(청주공항)",
    type: "civilian",
    coordinates: {
      lat: 36.716388888888886,
      lng: 127.49916666666667
    },
    description: "<div>청주공항<br></div><div>ELEV : 58<br></div><div>RWY : 06-24<br></div><div>Call : </div>",
    frequencies: {
      atis: "128.85",
      approach: "134.00, 134.10, 134.40",
      tower: "118.70, 126.20",
      ground: "121.87",
      departure: "129.65",
      clearance: "121.875"
    }
  },
  {
    id: "RKTE",
    name: "K-60(성무비행장)",
    type: "airforce",
    coordinates: {
      lat: 36.56789271376446,
      lng: 127.5003402445912
    },
    description: "<div>성무비행장(공군사관학교)<br></div>",
    frequencies: {
      tower: "131.3, 126.2, 236.6, 363.9"
    }
  },
  {
    id: "RKTI",
    name: "K-75(중원비행장)",
    type: "airforce",
    coordinates: {
      lat: 37.03198524327773,
      lng: 127.8863884700893
    },
    description: "<div>중원비행장<br></div><div>ELVE : 281<br></div><div>RWY : 36-18<br></div><div>Call : 941-3523(운항실) / 941-3033(작전과)<br></div>",
    frequencies: {
      tower: "126.2, 230.15, 236.6",
      ground: "275.8"
    }
  },
  {
    id: "RKTP",
    name: "K-76(서산비행장)",
    type: "airforce",
    coordinates: {
      lat: 36.70168986443883,
      lng: 126.4859060080876
    },
    description: "<div>서산(해미)비행장<br></div><div>ELEV : 42<br></div><div>RWY : 03-21<br></div><div>Call : </div>",
    frequencies: {
      tower: "126.2, 236.6, 284.3",
      ground: "275.8",
      clearance: "275.8"
    }
  },
  {
    id: "RKRS",
    name: "G-113(수색비행장)",
    type: "army",
    coordinates: {
      lat: 37.60054452386565,
      lng: 126.869369963829
    },
    description: "<div>수색비행장(한국항공대)<br></div><div>ELEV : 64<br></div><div>RWY : 14-32<br></div><div>Call :981-2132 / 02-3158-4070 / 02-300-0227(TWR)<br></div>",
    frequencies: {
      tower: "129.3"
    }
  },
  {
    id: "RKRK",
    name: "G-213(가평비행장)",
    type: "army",
    coordinates: {
      lat: 37.8128883602875,
      lng: 127.357113318672
    },
    description: "<div>가평기지<br></div><div>ELEV : 389<br></div><div>RWY : 17-35<br></div><div>Call : 985-5332(운항실) / 985-5336(TWR)<br></div>",
    frequencies: {
      tower: "123.5"
    }
  },
  {
    id: "RKRD",
    name: "G-290(덕소비행장)",
    type: "army",
    coordinates: {
      lat: 37.60753647872803,
      lng: 127.2203860896836
    },
    description: "<div>덕소기지<br></div><div>ELEV : 174<br></div><div>RWY : 13-31<br></div><div>Call : 981-2035(운항실) / 981-2625(TWR)<br></div>",
    frequencies: {
      tower: "120.2"
    }
  },
  {
    id: "RKRG",
    name: "G-301(양평비행장)",
    type: "army",
    coordinates: {
      lat: 37.50120446009494,
      lng: 127.6302217924894
    },
    description: "<div>양평기지<br></div><div>ELEV : 249<br></div><div>RWY : 15-33<br></div><div>Call : 987-2534 / 031-640-2534<br></div>",
    frequencies: {
      tower: "125.45"
    }
  },
  {
    id: "RKMS",
    name: "G-307(춘천비행장)",
    type: "army",
    coordinates: {
      lat: 37.92958263593752,
      lng: 127.7577219830175
    },
    description: "<div>춘천기지<br></div><div>ELEV : 270<br></div><div>RWY : 08-26<br></div><div>Call : 982-2113 / 033-249-5156<br></div>",
    frequencies: {
      tower: "133.7"
    }
  },
  {
    id: "RKMB",
    name: "G-419(홍천비행장)",
    type: "army",
    coordinates: {
      lat: 37.7031204800295,
      lng: 127.9045959725081
    },
    description: "<div>홍천기지<br></div><div>ELEV : 436<br></div><div>RWY : 07-25<br></div><div>Call : 971-3851(OPS), 811-5363(UAV) / 033-434-4647<br></div>",
    frequencies: {
      tower: "132.25"
    }
  },
  {
    id: "RKMA",
    name: "G-420(현리비행장)",
    type: "army",
    coordinates: {
      lat: 37.95632735967137,
      lng: 128.3165533246989
    },
    description: "<div>현리기지<br></div><div>ELEV : 955<br></div><div>RWY : 03-21<br></div><div>Call : 983-2163(OPS), 983-2166,2167(TWR) / 033-462-6541<br></div>",
    frequencies: {
      tower: "133.15"
    }
  },
  {
    id: "RKRY",
    name: "G-501(용인비행장)",
    type: "army",
    coordinates: {
      lat: 37.2876121352522,
      lng: 127.2263246699997
    },
    description: "<div>용인기지<br></div><div>ELEV : 243<br></div><div>RWY : 02-20<br></div><div>Call : 987-2037(17AVG)<br></div><div>973-2136(203AVN)<br></div><div>973-2433(MEDEON)<br></div><div>973-2545(70ASB)<br></div><div>031-640-2034,2037(17AVG)<br></div>",
    frequencies: {
      tower: "132.25"
    }
  },
  {
    id: "RKUC",
    name: "G-505(조치원비행장)",
    type: "army",
    coordinates: {
      lat: 36.57183473416186,
      lng: 127.296307468142
    },
    description: "<div>조치원기지<br></div><div>ELEV : 82<br></div><div>RWY : 14-32<br></div><div>Call : 967-5734,5634<br></div><div>044-866-6038, 044-867-6057<br></div>",
    frequencies: {
      tower: "121.85"
    }
  },
  {
    id: "RKRN",
    name: "G-510(이천비행장)",
    type: "army",
    coordinates: {
      lat: 37.20120915893458,
      lng: 127.4690813630199
    },
    description: "<div>이천기지<br></div><div>ELEV : 255<br></div><div>RWY : 10-28<br></div><div>Call : 967-5034,5035 / 031-644-3100,3101<br></div>",
    frequencies: {
      tower: "124.9",
      ground: "127.8"
    }
  },
  {
    id: "RKUL",
    name: "G-536(논산비행장)",
    type: "army",
    coordinates: {
      lat: 36.26854801099268,
      lng: 127.1128053317211
    },
    description: "<div>논산항공학교<br></div><div>ELEV : 104<br></div><div>RWY : 11-29<br></div><div>Call : 951-6491,6492(OPS) / 041-731-6491<br></div><div>951-6061(TWR) / 041-731-6061<br></div>",
    frequencies: {
      tower: "133.35, 30.20",
      ground: "386.4"
    }
  },
  {
    id: "RKUK",
    name: "G-610(금왕비행장)",
    type: "army",
    coordinates: {
      lat: 37.0026835396327,
      lng: 127.5624924439181
    },
    description: "<div>금왕기지<br></div><div>ELEV : 459<br></div><div>RWY : 10-28<br></div><div>Call : 967-2336 / 031-644-3905, 3907<br></div>",
    frequencies: {
      tower: "123.5"
    }
  },
  {
    id: "RKJU",
    name: "G-703(전주비행장)",
    type: "army",
    coordinates: {
      lat: 35.88069484393236,
      lng: 127.0150325340598
    },
    description: "<div>전주기지<br></div><div>ELEV : 35<br></div><div>RWY : 14-32<br></div><div>Call : 869-1532(A), 869-1236(U) / 063-542-0393<br></div>",
    frequencies: {
      tower: "120.2"
    }
  },
  {
    id: "RKSP",
    name: "RKSP(백령도)",
    type: "military",
    coordinates: {
      lat: 37.9667,
      lng: 124.6300
    },
    description: "백령도 공항"
  },
  {
    id: "RKNL",
    name: "RKNL(울릉도)",
    type: "military",
    coordinates: { lat: 37.4847, lng: 130.9053 },
    description: "울릉도 공항",
    frequencies: {}
  },
  {
    id: "RKSW",
    name: "RKSW(수원)",
    type: "military",
    coordinates: { lat: 37.2394, lng: 127.0058 },
    description: "수원 공항",
    frequencies: {}
  },
  {
    id: "RKTB",
    name: "RKTB(덕적도)",
    type: "military",
    coordinates: { lat: 37.2236, lng: 126.1400 },
    description: "덕적도 공항",
    frequencies: {}
  },
  {
    id: "RKSF",
    name: "RKSF(신용산)",
    type: "military",
    coordinates: { lat: 37.5333, lng: 127.0000 },
    description: "신용산 공항",
    frequencies: {}
  },
  {
    id: "RKTF",
    name: "RKTF(신도안)",
    type: "military",
    coordinates: { lat: 36.3667, lng: 127.3667 },
    description: "신도안 공항",
    frequencies: {}
  },
  {
    id: "RKTI",
    name: "RKTI(중원)",
    type: "military",
    coordinates: { lat: 37.0319, lng: 127.8864 },
    description: "중원 공항",
    frequencies: {}
  },
  {
    id: "RKTY",
    name: "RKTY(예천공항)",
    type: "military",
    coordinates: { lat: 36.6319, lng: 128.3555 },
    description: "예천 공항",
    frequencies: {}
  },
  {
    id: "RKSQ",
    name: "RKSQ(연평도)",
    type: "military",
    coordinates: { lat: 37.9781, lng: 124.6300 },
    description: "연평도 공항",
    frequencies: {}
  }
]; 