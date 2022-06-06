import { useApi, identityApiRef, alertApiRef } from '@backstage/core-plugin-api';
import { Tooltip } from '@material-ui/core';
import React, { useMemo, useEffect } from 'react';
import useAsync from 'react-use/lib/useAsync';

var English$2 = "Good morning";
var Afrikaans$2 = "Goeiemôre, Môre";
var Albanian$2 = "Mirëmëngjes";
var Arabic$2 = "صباح الخير";
var Armenian$2 = "Paree looys";
var Australian$2 = "G'day";
var Azerbaijani$2 = "Sabahınız xeyir";
var Bengali$2 = "shuprobhat";
var Bulgarian$2 = "Dobro utro";
var Catalan$1 = "Bon dia";
var Chinese$2 = "早安";
var Croatian$2 = "Dobro jutro";
var Czech$2 = "Dobré ráno";
var Danish$2 = "God morgen";
var Dutch$2 = "Goedemorgen";
var Esperanto$1 = "Bonan matenon";
var Estonian$2 = "Tere hommikust";
var Finnish$2 = "Hyvää huomenta";
var French$2 = "Bonjour";
var German$2 = "Guten Morgen";
var Greek$2 = "Kaliméra";
var Kalaallisut = "Iterluarit";
var Hawaiian$1 = "Aloha kakahiaka";
var Hebrew$2 = "boker tov";
var Hindi$1 = "Namaste";
var Hungarian$1 = "Jó reggelt";
var Indonesian$2 = "Selamat pagi";
var Irish = "Dia dhuit";
var Italian$2 = "Buongiorno";
var Japanese$2 = "おはよう";
var Korean$1 = "안녕하세요";
var Kazakh$2 = "Kayırlı tan";
var Kurdish$2 = "Beyanî baş";
var Lithuanian$2 = "Labas rytas";
var Macedonian$2 = "Добро утро";
var Malay$1 = "Selamat pagi";
var Maltese$2 = "Bonġu";
var Nepali$1 = "subha prabhat";
var Norwegian$1 = "God morgen";
var Odia$2 = "ସୁପ୍ରଭାତ";
var Polish$2 = "Dzień dobry";
var Portuguese$2 = "Bom dia";
var Romanian$2 = "Bună dimineaţa";
var Russian$2 = "Доброе утро";
var Serbian$2 = "Добро јутро";
var Spanish$1 = "Buenos días";
var Sumerian$2 = "𒄭𒌓";
var Swahili$1 = "Habari ya asubuhi";
var Swedish$2 = "God morgon";
var Tagalog$2 = "Magandang umaga po";
var Taiwanese = "爻早";
var Tatar$2 = "Xäyerle irtä";
var Telugu$2 = "శుభోదయం";
var Thai$2 = "สวัสดีครับ";
var Turkish$2 = "Günaydın";
var Ukrainian$2 = "Доброго ранку";
var Urdu$1 = "صبح بخير";
var Uzbek$2 = "Xayrli tong";
var Vietnamese$1 = "Chào buổi sáng";
var Welsh$2 = "Bore da";
var Latvian$2 = "Labrīt";
var Valyrian$1 = "Sȳz ñāqes";
var goodMorning = {
	English: English$2,
	Afrikaans: Afrikaans$2,
	Albanian: Albanian$2,
	Arabic: Arabic$2,
	Armenian: Armenian$2,
	Australian: Australian$2,
	Azerbaijani: Azerbaijani$2,
	Bengali: Bengali$2,
	Bulgarian: Bulgarian$2,
	Catalan: Catalan$1,
	Chinese: Chinese$2,
	Croatian: Croatian$2,
	Czech: Czech$2,
	Danish: Danish$2,
	Dutch: Dutch$2,
	Esperanto: Esperanto$1,
	Estonian: Estonian$2,
	Finnish: Finnish$2,
	French: French$2,
	German: German$2,
	Greek: Greek$2,
	Kalaallisut: Kalaallisut,
	Hawaiian: Hawaiian$1,
	Hebrew: Hebrew$2,
	Hindi: Hindi$1,
	Hungarian: Hungarian$1,
	Indonesian: Indonesian$2,
	Irish: Irish,
	Italian: Italian$2,
	Japanese: Japanese$2,
	Korean: Korean$1,
	Kazakh: Kazakh$2,
	Kurdish: Kurdish$2,
	Lithuanian: Lithuanian$2,
	"Low German": "Moin",
	Macedonian: Macedonian$2,
	Malay: Malay$1,
	Maltese: Maltese$2,
	"Middle Egyptian Hieroglyphs": "𓄤 𓃀 𓂓 𓇳𓐅",
	Nepali: Nepali$1,
	Norwegian: Norwegian$1,
	Odia: Odia$2,
	Polish: Polish$2,
	Portuguese: Portuguese$2,
	Romanian: Romanian$2,
	Russian: Russian$2,
	Serbian: Serbian$2,
	Spanish: Spanish$1,
	Sumerian: Sumerian$2,
	Swahili: Swahili$1,
	Swedish: Swedish$2,
	Tagalog: Tagalog$2,
	Taiwanese: Taiwanese,
	Tatar: Tatar$2,
	Telugu: Telugu$2,
	Thai: Thai$2,
	Turkish: Turkish$2,
	Ukrainian: Ukrainian$2,
	Urdu: Urdu$1,
	Uzbek: Uzbek$2,
	Vietnamese: Vietnamese$1,
	Welsh: Welsh$2,
	Latvian: Latvian$2,
	Valyrian: Valyrian$1
};

var English$1 = "Good afternoon";
var Abkhaz = "Уа, мшы бзиа";
var Adyghe = "Уимафэ шІу";
var Afrikaans$1 = "Goeie middag";
var Albanian$1 = "Mirëdita";
var Aleut = "Angaliichxizax̂";
var Aklan = "Mayad nga hapon";
var Alsatian = "Güete Nàchmittag";
var Arabic$1 = "مساء الخير";
var Armenian$1 = "Բարի կէսօր:";
var Assamese = "শুভ আবেলি";
var Asturian$1 = "Bones tardes";
var Australian$1 = "G'day";
var Azerbaijani$1 = "Günortanız xeyir";
var Bashkir = "хәйерле көн";
var Basque$1 = "Arratsalde on";
var Bavarian = "Guadn åmd";
var Bengali$1 = "শুভ বিকাল";
var Bhojpuri = "राम राम";
var Bosnian = "Dobar dan";
var Breton$1 = "Demat";
var Bulgarian$1 = "Добър ден";
var Cebuano = "Maayong Hapon";
var Chamorro$1 = "Buenas tåtdes";
var Chinese$1 = "午安";
var Cornish$1 = "Dohajydh da";
var Corsican = "Bonghjornu";
var Croatian$1 = "Dobar dan";
var Cuyonon = "Mayad nga apon";
var Czech$1 = "Dobré odpoledne";
var Danish$1 = "God eftermiddag";
var Dutch$1 = "Goedemiddag";
var Estonian$1 = "Tere päevast";
var Ewe = "Ŋdɔ";
var Faroese$1 = "Góðan dagin";
var Fijian$1 = "Bula";
var Finnish$1 = "Hyvää päivää";
var Flemish = "Ghoeie middagh";
var French$1 = "Bon après-midi";
var Friulian = "Bundì";
var Galician$1 = "Boa tarde";
var Georgian$1 = "დილა მშვიდობისა";
var German$1 = "Guten Tag";
var Greek$1 = "Καλό απόγευμα";
var Greenlandic = "Inuugujaq";
var Hausa = "Barka da yamma";
var Hawaiian = "Aloha ʻauinalā";
var Hebrew$1 = "אחר צהריים טובים";
var Hindi = "नमस्कार";
var Icelandic$1 = "Góðan dag";
var Iloko = "Naimbag a malem";
var Indonesian$1 = "Selamat sore";
var Gaelic = "Tráthnóna maith duit";
var Italian$1 = "Buongiorno";
var Japanese$1 = "こんにちは";
var Javanese = "Sugeng siang";
var Kannada = "ಶುಭ ಮಧ್ಯಾಹ್ನ";
var Kazakh$1 = "Kayırlı kun";
var Khmer = "ទិវាសួស្ដី";
var Korean = "안녕하세요";
var Kurdish$1 = "Rojbash";
var Kyrgyz = "Кутмандуу күнүңүз менен";
var Latvian$1 = "Labdien";
var Limburgish = "Gojemiddig";
var Lithuanian$1 = "Laba diena";
var Lozi = "Ki musihali";
var Luxembourgish$1 = "Gudde Mëtteg";
var Macedonian$1 = "Добар ден";
var Malagasy = "Manao ahoana e";
var Maltese$1 = "Wara nofsinhar it-tajjeb";
var Mam = "Qa’lte";
var Manx = "Fastyr mie";
var Nepali = "नमस्कार";
var Newari = "भिं न्हि";
var Norwegian = "God ettermiddag";
var Occitan = "Bon vèspre";
var Odia$1 = "ସୁଭ ଖରା ବେଳ";
var Papiamento = "Bon tardi";
var Pashto = "ورځ مو په خير";
var Polish$1 = "Dzień dobry";
var Portuguese$1 = "Boa tarde";
var Romanian$1 = "Bună ziua";
var Russian$1 = "Добрый день";
var Sakha = "Үтүө күнүнэн";
var Sardinian = "Bona sera";
var Scots$1 = "Guid efternuin";
var Serbian$1 = "Добар дан";
var Shona = "Masikati";
var Sicilian = "Bon jornu";
var Sinhala = "සුභ දවාලක්";
var Slovenian$1 = "Dober dan";
var Somali$1 = "Galab wanaagsan";
var Sumerian$1 = "𒄭𒌓𒁀";
var Swahili = "Habari ya mchana";
var Swedish$1 = "God eftermiddag";
var Tagalog$1 = "Magandang hapon po";
var Tamil = "மதிய வணக்கம்";
var Tatar$1 = "Xäyerle kön";
var Telugu$1 = "శుభ మద్యాహ్నం";
var Tetum = "Botarde";
var Thai$1 = "สวัสดีครับ";
var Tibetan = "ཉིན་གུང་བདེ་ལེགས།";
var Tongan = "Mālō tau ma‘u e ho‘ata ni";
var Tsonga = "Indzengha";
var Tswana = "Thupama e e monate";
var Turkish$1 = "Tünaydın";
var Ukrainian$1 = "Доброго дня";
var Urdu = "روز بخير";
var Uzbek$1 = "Xayrli kun";
var Venetian = "Bondì";
var Vietnamese = "Xin chào";
var Welsh$1 = "P'nawn da";
var Xhosa = "Uben' emva kwemini entle";
var Yapese = "Fal'e misii";
var Yiddish$1 = "א גוט אָוונט";
var Zazaki = "Perocê şıma xeyr bo";
var Zulu = "Sawubona";
var goodAfternoon = {
	English: English$1,
	Abkhaz: Abkhaz,
	Adyghe: Adyghe,
	Afrikaans: Afrikaans$1,
	Albanian: Albanian$1,
	Aleut: Aleut,
	Aklan: Aklan,
	Alsatian: Alsatian,
	Arabic: Arabic$1,
	Armenian: Armenian$1,
	Assamese: Assamese,
	Asturian: Asturian$1,
	Australian: Australian$1,
	Azerbaijani: Azerbaijani$1,
	Bashkir: Bashkir,
	Basque: Basque$1,
	Bavarian: Bavarian,
	Bengali: Bengali$1,
	Bhojpuri: Bhojpuri,
	Bosnian: Bosnian,
	Breton: Breton$1,
	Bulgarian: Bulgarian$1,
	Cebuano: Cebuano,
	Chamorro: Chamorro$1,
	Chinese: Chinese$1,
	Cornish: Cornish$1,
	Corsican: Corsican,
	Croatian: Croatian$1,
	Cuyonon: Cuyonon,
	Czech: Czech$1,
	Danish: Danish$1,
	Dutch: Dutch$1,
	Estonian: Estonian$1,
	Ewe: Ewe,
	Faroese: Faroese$1,
	Fijian: Fijian$1,
	Finnish: Finnish$1,
	Flemish: Flemish,
	French: French$1,
	"Frisian (North)": "Moin",
	"Frisian (West)": "Goeie middei",
	Friulian: Friulian,
	Galician: Galician$1,
	Georgian: Georgian$1,
	German: German$1,
	Greek: Greek$1,
	Greenlandic: Greenlandic,
	"Haitian Creole": "Bon apre-midi",
	Hausa: Hausa,
	Hawaiian: Hawaiian,
	Hebrew: Hebrew$1,
	Hindi: Hindi,
	Icelandic: Icelandic$1,
	Iloko: Iloko,
	Indonesian: Indonesian$1,
	"Iñupiaq": "Unnusatkun",
	Gaelic: Gaelic,
	Italian: Italian$1,
	Japanese: Japanese$1,
	Javanese: Javanese,
	"Jèrriais": "Bouônjour",
	Kannada: Kannada,
	Kazakh: Kazakh$1,
	Khmer: Khmer,
	Korean: Korean,
	Kurdish: Kurdish$1,
	Kyrgyz: Kyrgyz,
	Latvian: Latvian$1,
	Limburgish: Limburgish,
	Lithuanian: Lithuanian$1,
	"Low German": "Moin",
	Lozi: Lozi,
	"Lule Sámi": "Buorre biejvve",
	Luxembourgish: Luxembourgish$1,
	Macedonian: Macedonian$1,
	Malagasy: Malagasy,
	Maltese: Maltese$1,
	Mam: Mam,
	Manx: Manx,
	"Māori": "Kia ora",
	"Middle Egyptian Hieroglyphs": "𓄤  𓅓𓈙𓂋𓅱𓇰",
	Nepali: Nepali,
	Newari: Newari,
	"Northern Sámi": "Buorre beaivvi",
	"Northern Sotho": "Dumêlang",
	Norwegian: Norwegian,
	Occitan: Occitan,
	Odia: Odia$1,
	Papiamento: Papiamento,
	Pashto: Pashto,
	Polish: Polish$1,
	Portuguese: Portuguese$1,
	Romanian: Romanian$1,
	Russian: Russian$1,
	Sakha: Sakha,
	Sardinian: Sardinian,
	"Scottish Gaelic": "Feasgar math",
	Scots: Scots$1,
	Serbian: Serbian$1,
	Shona: Shona,
	Sicilian: Sicilian,
	Sinhala: Sinhala,
	Slovenian: Slovenian$1,
	Somali: Somali$1,
	"Southern Sámi": "Buerie biejjie",
	Sumerian: Sumerian$1,
	Swahili: Swahili,
	Swedish: Swedish$1,
	"Swiss German": "Gueten Abig",
	Tagalog: Tagalog$1,
	Tamil: Tamil,
	Tatar: Tatar$1,
	Telugu: Telugu$1,
	Tetum: Tetum,
	Thai: Thai$1,
	Tibetan: Tibetan,
	"Tok Pisin": "Apinum",
	Tongan: Tongan,
	Tsonga: Tsonga,
	Tswana: Tswana,
	Turkish: Turkish$1,
	Ukrainian: Ukrainian$1,
	Urdu: Urdu,
	Uzbek: Uzbek$1,
	Venetian: Venetian,
	Vietnamese: Vietnamese,
	"Võro": "Hüvvä lõunaaigo",
	Welsh: Welsh$1,
	Xhosa: Xhosa,
	Yapese: Yapese,
	Yiddish: Yiddish$1,
	"Yucatec Maya": "Ma'lob chi'inil K'iin",
	Zazaki: Zazaki,
	Zulu: Zulu
};

var Afrikaans = "Goeienaand";
var Aklanon = "Mayad nga gabi-i";
var Albanian = "Mirëmbrëma";
var Arabic = "Masaa al-khair";
var Aragonese = "Buena nuei";
var Armenian = "Pari yerego";
var Aromunian = "Bunã seara";
var Asante = "Maadwó";
var Asturian = "Bona nuechi";
var Ateso = "Akwar najokan";
var Australian = "G'day";
var Aymara = "Winas tartis";
var Azerbaijani = "Axşamınız xeyir";
var Basque = "Arratsalde on";
var Belorussian = "Dobry viechar";
var Bemba = "Cungulopo mukwai";
var Bengali = "Shuvo shandhya";
var Bilen = "Aja kunduKw’ma?";
var Breton = "Noz vat";
var Bulgarian = "Dobar vecher";
var Cantonese = "Maan ngon";
var Cassubian = "Dobri wieczór";
var Catalan = "Bona tarda";
var Chamorro = "Pupuengin maolek";
var Chechen = "Sürea dika yoila";
var Comoran = "Bariza massihou";
var Cornish = "Gorthugher da";
var Croatian = "Dobra večer";
var Czech = "Dobrý večer";
var Danish = "God aften";
var Dutch = "Goedenavond";
var Edo = "Ób’ótà";
var English = "Good evening";
var Esperanto = "Bonan vesperon";
var Estonian = "Tere õhtust";
var Faroese = "Gott kvøld";
var Farsi = "Shab beh'khayr";
var Fijian = "Ni sa bogi";
var Finnish = "Hyvää iltaa";
var French = "Bonsoir";
var Galician = "Boas noites";
var Georgian = "Saghamo mshvidobisa";
var German = "Guten Abend";
var Greek = "Kalinichta";
var Guarani = "Mba’éichapa ndepyhare";
var Hebrew = "Erev tov";
var Hungarian = "Jó estét";
var Icelandic = "Gott kvöld";
var Indonesian = "Selamat malam";
var Italian = "Buona sera";
var Japanese = "こんばんは";
var Kazakh = "Kayırlı keş";
var Kurdish = "Evarbash";
var Latvian = "Labvakar";
var Lithuanian = "Labas vakaras";
var Luganda = "Osiibye otya nno";
var Luo = "Oimore";
var Luxembourgish = "Gudden Owend";
var Macedonian = "Dobra vecher";
var Malay = "Selamat malam";
var Maltese = "Il-lejla t-tajba";
var Mandarin = "Wan shang hao";
var Maori = "Kia orana ‘i teia a’ia’i";
var Marshallese = "Yokwe in jota";
var Mawe = "Awãe aiko";
var Mongolian = "Odoin mend";
var Odia = "ସୁଭସନ୍ଧ୍ୟା";
var Polish = "Dobry wieczór";
var Portuguese = "Boa noite";
var Romanian = "Bunã seara";
var Russian = "Добрый вечер";
var Scots = "Guid eenin";
var Sesotho = "Fonane";
var Serbian = "Добро вече";
var Slovak = "Dober vecher";
var Slovenian = "Dober vecher";
var Somali = "Habeen wanaagsan";
var Spanish = "Buenas tardes";
var Sumerian = "𒄭𒈪";
var Swedish = "God afton";
var Tagalog = "Magandang gabi";
var Tatar = "Xäyerle kiç";
var Telugu = "శుభ సాయంత్రం";
var Thai = "Sawat-dii torn khum";
var Turkish = "İyi akşamlar";
var Ukrainian = "Добрий вечiр";
var Uzbek = "Xayrli kech";
var Welsh = "Noswaith dda";
var Yiddish = "Ah gutn ovnt";
var Chinese = "晚安";
var Valyrian = "sȳz bantis";
var goodEvening = {
	Afrikaans: Afrikaans,
	Aklanon: Aklanon,
	Albanian: Albanian,
	"Anglo-Saxon": "God æfen",
	Arabic: Arabic,
	Aragonese: Aragonese,
	Armenian: Armenian,
	Aromunian: Aromunian,
	Asante: Asante,
	Asturian: Asturian,
	Ateso: Ateso,
	Australian: Australian,
	Aymara: Aymara,
	Azerbaijani: Azerbaijani,
	Basque: Basque,
	Belorussian: Belorussian,
	Bemba: Bemba,
	Bengali: Bengali,
	Bilen: Bilen,
	Breton: Breton,
	Bulgarian: Bulgarian,
	Cantonese: Cantonese,
	Cassubian: Cassubian,
	Catalan: Catalan,
	Chamorro: Chamorro,
	Chechen: Chechen,
	Comoran: Comoran,
	Cornish: Cornish,
	Croatian: Croatian,
	Czech: Czech,
	Danish: Danish,
	Dutch: Dutch,
	Edo: Edo,
	English: English,
	Esperanto: Esperanto,
	Estonian: Estonian,
	Faroese: Faroese,
	Farsi: Farsi,
	Fijian: Fijian,
	Finnish: Finnish,
	French: French,
	Galician: Galician,
	Georgian: Georgian,
	German: German,
	Greek: Greek,
	Guarani: Guarani,
	Hebrew: Hebrew,
	Hungarian: Hungarian,
	Icelandic: Icelandic,
	Indonesian: Indonesian,
	"Irish Gaelic": "Tráthnóna",
	Italian: Italian,
	Japanese: Japanese,
	"Japanese (Romanji)": "Konban wa",
	Kazakh: Kazakh,
	Kurdish: Kurdish,
	Latvian: Latvian,
	Lithuanian: Lithuanian,
	"Low German": "Moin",
	Luganda: Luganda,
	Luo: Luo,
	Luxembourgish: Luxembourgish,
	Macedonian: Macedonian,
	Malay: Malay,
	Maltese: Maltese,
	Mandarin: Mandarin,
	Maori: Maori,
	Marshallese: Marshallese,
	Mawe: Mawe,
	"Middle Egyptian Hieroglyphs": "𓄤  𓅱𓃉𓇰",
	Mongolian: Mongolian,
	"Norwegian [Bokmaal]": "God kveld",
	Odia: Odia,
	Polish: Polish,
	Portuguese: Portuguese,
	"Quiché": "Xe q’ij",
	"Romani [Sinte]": "Lashi rachi",
	Romanian: Romanian,
	Russian: Russian,
	"Scottish Gaelic": "Feasgar mhath",
	Scots: Scots,
	Sesotho: Sesotho,
	Serbian: Serbian,
	Slovak: Slovak,
	Slovenian: Slovenian,
	Somali: Somali,
	Spanish: Spanish,
	Sumerian: Sumerian,
	Swedish: Swedish,
	Tagalog: Tagalog,
	Tatar: Tatar,
	Telugu: Telugu,
	Thai: Thai,
	Turkish: Turkish,
	Ukrainian: Ukrainian,
	Uzbek: Uzbek,
	Welsh: Welsh,
	Yiddish: Yiddish,
	Chinese: Chinese,
	Valyrian: Valyrian
};

const greetingRandomSeed = Math.floor(Math.random() * 1e6);
function getTimeBasedGreeting() {
  const random = (array) => array[greetingRandomSeed % array.length];
  const currentHour = new Date(Date.now()).getHours();
  if (currentHour >= 23) {
    return {
      language: "Seriously",
      greeting: "Get some rest"
    };
  }
  const timeOfDay = (hour) => {
    if (hour < 12)
      return goodMorning;
    if (hour < 17)
      return goodAfternoon;
    return goodEvening;
  };
  const greetings = timeOfDay(currentHour);
  const greetingsKey = random(Object.keys(greetings));
  return {
    language: greetingsKey,
    greeting: greetings[greetingsKey]
  };
}

const WelcomeTitle = () => {
  const identityApi = useApi(identityApiRef);
  const alertApi = useApi(alertApiRef);
  const greeting = useMemo(() => getTimeBasedGreeting(), []);
  const { value: profile, error } = useAsync(() => identityApi.getProfileInfo());
  useEffect(() => {
    if (error) {
      alertApi.post({
        message: `Failed to load user identity: ${error}`,
        severity: "error"
      });
    }
  }, [error, alertApi]);
  return /* @__PURE__ */ React.createElement(Tooltip, {
    title: greeting.language
  }, /* @__PURE__ */ React.createElement("span", null, `${greeting.greeting}${(profile == null ? void 0 : profile.displayName) ? `, ${profile == null ? void 0 : profile.displayName}` : ""}!`));
};

export { WelcomeTitle };
//# sourceMappingURL=index-f1d655aa.esm.js.map
