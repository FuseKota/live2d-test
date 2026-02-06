/**
 * 観光スポットデータ（5件）
 * Phase 2: 多言語(ja/en/zh)、写真、住所、営業時間、料金、おすすめ、字幕、表情/モーション
 */

import { Spot } from '../types/spot';

export const spots: Spot[] = [
  {
    id: 'kinkakuji',
    name: {
      ja: '金閣寺',
      en: 'Kinkaku-ji (Golden Pavilion)',
      zh: '金阁寺',
    },
    description: {
      ja: '正式名称は鹿苑寺。金箔で覆われた三層の楼閣が鏡湖池に映る姿は、京都を代表する景観として世界的に有名です。室町幕府三代将軍・足利義満が建立し、1994年にユネスコ世界遺産に登録されました。四季折々の美しさがあり、特に冬の雪景色は格別です。',
      en: 'Officially known as Rokuon-ji, the three-story golden pavilion reflected in Kyoko-chi pond is one of Kyoto\'s most iconic sights. Built by Ashikaga Yoshimitsu, the third shogun of the Muromachi shogunate, it was designated a UNESCO World Heritage Site in 1994. The temple is beautiful in all seasons, with the snow-covered scene in winter being particularly spectacular.',
      zh: '正式名称为鹿苑寺。覆盖金箔的三层楼阁倒映在镜湖池中的景象，作为京都的代表性景观享誉世界。由室町幕府第三代将军足利义满建造，1994年被列入联合国教科文组织世界遗产。四季各有不同的美丽，尤其冬季的雪景格外壮观。',
    },
    imageUrl: 'https://picsum.photos/seed/kinkakuji/400/300',
    images: [
      'https://picsum.photos/seed/kinkakuji1/400/300',
      'https://picsum.photos/seed/kinkakuji2/400/300',
      'https://picsum.photos/seed/kinkakuji3/400/300',
      'https://picsum.photos/seed/kinkakuji4/400/300',
    ],
    audioGuideUrl: 'https://example.com/audio/kinkakuji.mp3',
    subtitles: {
      ja: '金閣寺は正式には鹿苑寺と呼ばれ、京都で最も有名な観光スポットの一つです。金箔に覆われた美しい三層の楼閣をお楽しみください。',
      en: 'Kinkaku-ji, officially known as Rokuon-ji, is one of Kyoto\'s most famous landmarks. Enjoy the beautiful three-story pavilion covered in gold leaf.',
      zh: '金阁寺正式名称为鹿苑寺，是京都最著名的观光景点之一。请欣赏覆盖金箔的美丽三层楼阁。',
    },
    location: {
      latitude: 35.0394,
      longitude: 135.7292,
    },
    category: 'temple',
    estimatedDuration: 60,
    tags: ['世界遺産', '金閣', '庭園', '室町時代'],
    address: {
      ja: '〒603-8361 京都府京都市北区金閣寺町1',
      en: '1 Kinkakuji-cho, Kita-ku, Kyoto 603-8361',
      zh: '〒603-8361 京都府京都市北区金阁寺町1',
    },
    accessInfo: {
      ja: '市バス「金閣寺道」下車 徒歩3分',
      en: '3 min walk from Kinkakuji-michi bus stop',
      zh: '市巴士「金阁寺道」下车 步行3分钟',
    },
    businessHours: {
      ja: '9:00〜17:00（年中無休）',
      en: '9:00-17:00 (Open year-round)',
      zh: '9:00〜17:00（全年无休）',
    },
    admission: {
      ja: '大人（高校生以上）500円 / 小・中学生 300円',
      en: 'Adults (High school+): ¥500 / Children: ¥300',
      zh: '成人（高中生以上）500日元 / 中小学生 300日元',
    },
    highlights: [
      {
        ja: '鏡湖池に映る金閣の姿は必見',
        en: 'The reflection of the golden pavilion in Kyoko-chi pond is a must-see',
        zh: '镜湖池中倒映的金阁身影不容错过',
      },
      {
        ja: '舎利殿の三層それぞれ異なる建築様式',
        en: 'Three different architectural styles in each floor of the pavilion',
        zh: '舍利殿三层各有不同的建筑风格',
      },
      {
        ja: '庭園の石組みと松の美しい調和',
        en: 'Beautiful harmony of rock arrangements and pine trees in the garden',
        zh: '庭园中石组与松树的美丽和谐',
      },
    ],
    expression: 'f01',
    motion: { group: 'Idle', index: 0 },
  },
  {
    id: 'fushimi-inari',
    name: {
      ja: '伏見稲荷大社',
      en: 'Fushimi Inari Taisha',
      zh: '伏见稻荷大社',
    },
    description: {
      ja: '全国に約3万社ある稲荷神社の総本宮。朱色の千本鳥居が稲荷山の山頂まで続く光景は圧巻で、国内外の観光客に大人気のスポットです。711年に創建され、商売繁昌・五穀豊穣の神として信仰を集めています。山頂までの参拝路は約4km、所要時間は約2時間です。',
      en: 'The head shrine of approximately 30,000 Inari shrines across Japan. The breathtaking sight of thousands of vermillion torii gates winding up Mount Inari is immensely popular with visitors from around the world. Founded in 711, it is revered as the god of business prosperity and abundant harvests. The trail to the summit is approximately 4km and takes about 2 hours.',
      zh: '全日本约3万座稻荷神社的总本宫。朱红色的千本�的鸟居一直延伸到稻荷山山顶的景象令人叹为观止，深受国内外游客的喜爱。创建于711年，作为商业繁荣和五谷丰登之神而备受信仰。到山顶的参拜路约4公里，所需时间约2小时。',
    },
    imageUrl: 'https://picsum.photos/seed/fushimi/400/300',
    images: [
      'https://picsum.photos/seed/fushimi1/400/300',
      'https://picsum.photos/seed/fushimi2/400/300',
      'https://picsum.photos/seed/fushimi3/400/300',
      'https://picsum.photos/seed/fushimi4/400/300',
      'https://picsum.photos/seed/fushimi5/400/300',
    ],
    audioGuideUrl: 'https://example.com/audio/fushimi-inari.mp3',
    subtitles: {
      ja: '伏見稲荷大社は千本鳥居で有名な、日本で最も訪問者数の多い神社の一つです。朱色の鳥居が山頂まで続く幻想的な景色をご案内します。',
      en: 'Fushimi Inari Taisha, famous for its thousands of torii gates, is one of the most visited shrines in Japan. Let me guide you through the mystical landscape of vermillion gates stretching to the mountaintop.',
      zh: '伏见稻荷大社以千本鸟居闻名，是日本访客最多的神社之一。让我为您介绍朱红色鸟居延伸至山顶的梦幻景色。',
    },
    location: {
      latitude: 34.9671,
      longitude: 135.7727,
    },
    category: 'shrine',
    estimatedDuration: 120,
    tags: ['千本鳥居', '稲荷山', 'パワースポット', '写真映え'],
    address: {
      ja: '〒612-0882 京都府京都市伏見区深草藪之内町68',
      en: '68 Fukakusa Yabunouchicho, Fushimi-ku, Kyoto 612-0882',
      zh: '〒612-0882 京都府京都市伏见区深草薮之内町68',
    },
    accessInfo: {
      ja: 'JR奈良線「稲荷」駅下車 すぐ / 京阪「伏見稲荷」駅 徒歩5分',
      en: 'Directly at JR Inari Station / 5 min walk from Keihan Fushimi-Inari Station',
      zh: 'JR奈良线「稻荷」站下车即到 / 京阪「伏见稻荷」站步行5分钟',
    },
    businessHours: {
      ja: '境内自由（24時間参拝可能）',
      en: 'Open 24 hours (free access to grounds)',
      zh: '境内自由（24小时可参拜）',
    },
    admission: {
      ja: '無料',
      en: 'Free',
      zh: '免费',
    },
    highlights: [
      {
        ja: '千本鳥居のトンネルは圧巻の写真スポット',
        en: 'The tunnel of thousands of torii gates is an incredible photo spot',
        zh: '千本鸟居隧道是令人叹为观止的拍照景点',
      },
      {
        ja: '山頂からの京都市街の眺望',
        en: 'Panoramic views of Kyoto city from the summit',
        zh: '从山顶眺望京都市区的全景',
      },
      {
        ja: '狐の像や絵馬など独特の文化体験',
        en: 'Unique cultural experiences with fox statues and ema votive tablets',
        zh: '狐狸雕像和绘马等独特的文化体验',
      },
    ],
    expression: 'f02',
    motion: { group: 'Tap', index: 0 },
  },
  {
    id: 'kiyomizudera',
    name: {
      ja: '清水寺',
      en: 'Kiyomizu-dera',
      zh: '清水寺',
    },
    description: {
      ja: '「清水の舞台から飛び降りる」という言葉で知られる京都東山の名刹。本堂の舞台は高さ約13メートルの崖の上に、釘を一本も使わずに組み上げられた檜舞台です。778年に創建され、1994年にユネスコ世界遺産に登録されました。桜と紅葉の名所としても有名で、夜間ライトアップは幻想的な美しさです。',
      en: 'Famous for the expression "jumping off the stage at Kiyomizu," this celebrated temple stands on the eastern hills of Kyoto. The main hall\'s wooden stage extends over 13 meters above the hillside, built entirely without nails. Founded in 778 and designated a UNESCO World Heritage Site in 1994, it is renowned for cherry blossoms and autumn foliage, with evening illuminations creating an enchanting atmosphere.',
      zh: '以"从清水舞台跳下"这句俗语而闻名的京都东山名刹。正殿的舞台建在约13米高的悬崖上，完全不使用一根钉子的纯木结构。创建于778年，1994年被列入联合国教科文组织世界遗产。作为赏樱和红叶的名所也非常有名，夜间灯光照明美得如梦如幻。',
    },
    imageUrl: 'https://picsum.photos/seed/kiyomizu/400/300',
    images: [
      'https://picsum.photos/seed/kiyomizu1/400/300',
      'https://picsum.photos/seed/kiyomizu2/400/300',
      'https://picsum.photos/seed/kiyomizu3/400/300',
    ],
    audioGuideUrl: 'https://example.com/audio/kiyomizudera.mp3',
    subtitles: {
      ja: '清水寺は京都で最も人気のあるお寺の一つです。有名な清水の舞台からは、京都市街を一望できる素晴らしい眺めが広がります。',
      en: 'Kiyomizu-dera is one of the most popular temples in Kyoto. From the famous wooden stage, you can enjoy a magnificent panoramic view of the city.',
      zh: '清水寺是京都最受欢迎的寺院之一。从著名的清水舞台上可以一览京都市区的壮丽景色。',
    },
    location: {
      latitude: 34.9949,
      longitude: 135.7850,
    },
    category: 'temple',
    estimatedDuration: 90,
    tags: ['世界遺産', '清水の舞台', '紅葉', '桜'],
    address: {
      ja: '〒605-0862 京都府京都市東山区清水1-294',
      en: '1-294 Kiyomizu, Higashiyama-ku, Kyoto 605-0862',
      zh: '〒605-0862 京都府京都市东山区清水1-294',
    },
    accessInfo: {
      ja: '市バス「清水道」または「五条坂」下車 徒歩10分',
      en: '10 min walk from Kiyomizu-michi or Gojo-zaka bus stop',
      zh: '市巴士「清水道」或「五条坂」下车步行10分钟',
    },
    businessHours: {
      ja: '6:00〜18:00（季節により変動、夜間特別拝観あり）',
      en: '6:00-18:00 (varies by season, special evening illuminations available)',
      zh: '6:00〜18:00（因季节而异，有夜间特别参拜）',
    },
    admission: {
      ja: '大人 400円 / 小・中学生 200円',
      en: 'Adults: ¥400 / Children: ¥200',
      zh: '成人 400日元 / 中小学生 200日元',
    },
    highlights: [
      {
        ja: '清水の舞台からの京都市街の絶景',
        en: 'Stunning views of Kyoto from the Kiyomizu stage',
        zh: '从清水舞台远眺京都市区的绝景',
      },
      {
        ja: '音羽の滝で三つの流れから願い事',
        en: 'Make wishes at the three streams of Otowa Waterfall',
        zh: '在音羽瀑布的三道水流许愿',
      },
      {
        ja: '参道の二寧坂・三年坂は風情ある散策路',
        en: 'Scenic walks along Ninenzaka and Sannenzaka slopes',
        zh: '二年坂・三年坂参道充满风情的散步路线',
      },
    ],
    expression: 'f03',
    motion: { group: 'Idle', index: 1 },
  },
  {
    id: 'arashiyama-bamboo',
    name: {
      ja: '嵐山竹林',
      en: 'Arashiyama Bamboo Grove',
      zh: '岚山竹林',
    },
    description: {
      ja: '嵐山エリアにある天龍寺の北側に広がる竹林の小径。空を覆うほどの青竹が両側にそびえ、風に揺れる竹の音は「日本の音風景100選」にも選ばれています。早朝の訪問がおすすめで、人が少なく幻想的な雰囲気を楽しめます。近くには渡月橋や天龍寺など見どころも多く、散策にぴったりのエリアです。',
      en: 'A bamboo-lined path stretching north of Tenryu-ji temple in the Arashiyama area. Towering green bamboo stalks rise on both sides, blocking out the sky, and the sound of wind through the bamboo was selected as one of Japan\'s "100 Soundscapes." Early morning visits are recommended for a more serene atmosphere. The nearby Togetsukyo Bridge and Tenryu-ji temple make this area perfect for leisurely exploration.',
      zh: '位于岚山地区天龙寺北侧的竹林小径。两侧耸立着遮天蔽日的青竹，竹子在风中摇曳的声音被选为"日本音风景百选"之一。推荐清晨前往，人少时可以享受梦幻般的氛围。附近还有渡月桥和天龙寺等众多景点，是散步的绝佳区域。',
    },
    imageUrl: 'https://picsum.photos/seed/bamboo/400/300',
    images: [
      'https://picsum.photos/seed/bamboo1/400/300',
      'https://picsum.photos/seed/bamboo2/400/300',
      'https://picsum.photos/seed/bamboo3/400/300',
      'https://picsum.photos/seed/bamboo4/400/300',
    ],
    audioGuideUrl: 'https://example.com/audio/arashiyama-bamboo.mp3',
    subtitles: {
      ja: '嵐山竹林は京都を代表する自然スポットです。竹のさざめきに耳を傾けながら、幻想的な緑のトンネルをお楽しみください。',
      en: 'The Arashiyama Bamboo Grove is one of Kyoto\'s iconic natural spots. Listen to the rustling bamboo and enjoy the magical green tunnel.',
      zh: '岚山竹林是京都代表性的自然景点。请倾听竹子的沙沙声，享受梦幻般的绿色隧道。',
    },
    location: {
      latitude: 35.0173,
      longitude: 135.6717,
    },
    category: 'nature',
    estimatedDuration: 45,
    tags: ['竹林', '嵐山', '散策', '写真映え'],
    address: {
      ja: '〒616-8394 京都府京都市右京区嵯峨天龍寺芒ノ馬場町',
      en: 'Sagatenryuji Susukinobabacho, Ukyo-ku, Kyoto 616-8394',
      zh: '〒616-8394 京都府京都市右京区嵯峨天龙寺芒之马场町',
    },
    accessInfo: {
      ja: 'JR嵯峨野線「嵯峨嵐山」駅 徒歩13分 / 嵐電「嵐山」駅 徒歩3分',
      en: '13 min walk from JR Saga-Arashiyama Station / 3 min walk from Randen Arashiyama Station',
      zh: 'JR�的峨野线「嵯峨岚山」站步行13分钟 / 岚电「岚山」站步行3分钟',
    },
    businessHours: {
      ja: '散策自由（24時間）',
      en: 'Open 24 hours (free access)',
      zh: '自由散步（24小时）',
    },
    admission: {
      ja: '無料',
      en: 'Free',
      zh: '免费',
    },
    highlights: [
      {
        ja: '早朝の静寂な竹林散策が格別',
        en: 'Early morning walks through the quiet bamboo grove are exceptional',
        zh: '清晨宁静的竹林散步格外特别',
      },
      {
        ja: '渡月橋から見る嵐山の四季の景色',
        en: 'Seasonal views of Arashiyama from Togetsukyo Bridge',
        zh: '从渡月桥观赏岚山四季美景',
      },
      {
        ja: '天龍寺の庭園と合わせて訪問がおすすめ',
        en: 'Recommended to combine with a visit to Tenryu-ji temple garden',
        zh: '推荐结合天龙寺庭园一起参观',
      },
    ],
    expression: 'f04',
    motion: { group: 'Idle', index: 0 },
  },
  {
    id: 'nishiki-market',
    name: {
      ja: '錦市場',
      en: 'Nishiki Market',
      zh: '锦市场',
    },
    description: {
      ja: '「京の台所」と呼ばれる約400年の歴史を持つ商店街。錦小路通の東西約390メートルに約130の店舗が軒を連ね、京野菜、漬物、鮮魚、乾物など京都ならではの食材や料理が並びます。食べ歩きも楽しめ、京都の食文化を体感できるスポットです。午前中の訪問がおすすめで、新鮮な食材と活気ある雰囲気を楽しめます。',
      en: 'Known as "Kyoto\'s Kitchen," this shopping street has over 400 years of history. Approximately 130 shops line the 390-meter stretch of Nishikikoji Street, offering Kyoto-specific ingredients and dishes including Kyoto vegetables, pickles, fresh fish, and dried goods. Perfect for sampling street food and experiencing Kyoto\'s culinary culture. Morning visits are recommended for the freshest ingredients and liveliest atmosphere.',
      zh: '被称为"京都的厨房"的拥有约400年历史的商店街。在锦小路通东西约390米的街道上，约130家店铺鳞次栉比，陈列着京野菜、腌菜、鲜鱼、干货等京都特有的食材和料理。可以边走边吃，是体验京都饮食文化的好去处。推荐上午前往，可以享受新鲜的食材和热闹的氛围。',
    },
    imageUrl: 'https://picsum.photos/seed/nishiki/400/300',
    images: [
      'https://picsum.photos/seed/nishiki1/400/300',
      'https://picsum.photos/seed/nishiki2/400/300',
      'https://picsum.photos/seed/nishiki3/400/300',
      'https://picsum.photos/seed/nishiki4/400/300',
      'https://picsum.photos/seed/nishiki5/400/300',
    ],
    audioGuideUrl: 'https://example.com/audio/nishiki-market.mp3',
    subtitles: {
      ja: '錦市場は「京の台所」として400年以上の歴史を持つ活気あふれる商店街です。京都ならではの食の魅力をご紹介します。',
      en: 'Nishiki Market, known as "Kyoto\'s Kitchen," is a vibrant shopping street with over 400 years of history. Let me introduce you to Kyoto\'s unique food culture.',
      zh: '锦市场被誉为"京都的厨房"，是拥有400多年历史的充满活力的商店街。让我为您介绍京都独特的饮食魅力。',
    },
    location: {
      latitude: 35.0051,
      longitude: 135.7649,
    },
    category: 'food',
    estimatedDuration: 60,
    tags: ['食べ歩き', '京の台所', '商店街', '京野菜'],
    address: {
      ja: '〒604-8054 京都府京都市中京区錦小路通',
      en: 'Nishikikoji-dori, Nakagyo-ku, Kyoto 604-8054',
      zh: '〒604-8054 京都府京都市中京区锦小路通',
    },
    accessInfo: {
      ja: '地下鉄「四条」駅 徒歩3分 / 阪急「烏丸」駅 徒歩3分',
      en: '3 min walk from Subway Shijo Station / 3 min walk from Hankyu Karasuma Station',
      zh: '地铁「四条」站步行3分钟 / �的急「乌丸」站步行3分钟',
    },
    businessHours: {
      ja: '各店舗により異なる（多くは10:00〜17:00）',
      en: 'Varies by shop (most open 10:00-17:00)',
      zh: '各店铺不同（大多为10:00〜17:00）',
    },
    admission: {
      ja: '入場無料（各店舗での購入は別途）',
      en: 'Free entry (purchases at individual shops)',
      zh: '免费入场（各店铺消费另计）',
    },
    highlights: [
      {
        ja: '京漬物や出汁巻き玉子の食べ歩き',
        en: 'Street food sampling: Kyoto pickles and rolled egg',
        zh: '边走边品尝京都腌菜和出汁卷蛋',
      },
      {
        ja: '新鮮な京野菜や季節の食材',
        en: 'Fresh Kyoto vegetables and seasonal ingredients',
        zh: '新鲜的京都蔬菜和时令食材',
      },
      {
        ja: '抹茶スイーツやお土産探し',
        en: 'Matcha sweets and souvenir shopping',
        zh: '抹茶甜点和伴手礼选购',
      },
    ],
    expression: 'f05',
    motion: { group: 'Tap', index: 0 },
  },
];

/**
 * IDでスポットを検索
 */
export const getSpotById = (id: string): Spot | undefined => {
  return spots.find((spot) => spot.id === id);
};
