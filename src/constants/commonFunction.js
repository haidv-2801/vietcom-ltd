import {
  GUID_NULL,
  TEXT_FALL_BACK,
  SECTION_TEXT,
  PATH_NAME,
  RESERVATION_STATUS,
  FILTER_TIME_VALUE,
  MEMBER_TYPE,
  CARD_STATUS,
} from './commonConstant';
import moment from 'moment';

/**
 * Build ra classname
 * @param {*} arr mảng class và logic
 */
export const buildClass = (arr = []) => {
  return arr.filter(Boolean).join(' ');
};

/**
 * Build query params từ object
 * @param {*} obj object
 */
export const objectToQueryParams = function (obj) {
  var str = [],
    join = '';

  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }

  join = str.join('&');
  if (join.length > 0) join = '?' + join;

  return join;
};

/**
 *Lấy ra tên rút gọn
 *VD: do van hai -> dh
 */
export const getSmallName = (name) => {
  if (name instanceof String || typeof name == 'string') {
    if (name.length < 2) {
      return TEXT_FALL_BACK.TYPE_2;
    } else {
      let words = name?.split(/\s+/);
      if (words.length > 1) {
        return words[0][0] + words[words.length - 1][0];
      } else {
        return words[0][0] + words[0][1];
      }
    }
  }
  return TEXT_FALL_BACK.TYPE_2;
};

/**
 * Convert string ra dạng a-b-c
 * @param {*} str
 * @returns
 */
export const slugify = (str) => {
  str = String(str).toString();
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  const swaps = {
    0: ['°', '₀', '۰', '０'],
    1: ['¹', '₁', '۱', '１'],
    2: ['²', '₂', '۲', '２'],
    3: ['³', '₃', '۳', '３'],
    4: ['⁴', '₄', '۴', '٤', '４'],
    5: ['⁵', '₅', '۵', '٥', '５'],
    6: ['⁶', '₆', '۶', '٦', '６'],
    7: ['⁷', '₇', '۷', '７'],
    8: ['⁸', '₈', '۸', '８'],
    9: ['⁹', '₉', '۹', '９'],
    a: [
      'à',
      'á',
      'ả',
      'ã',
      'ạ',
      'ă',
      'ắ',
      'ằ',
      'ẳ',
      'ẵ',
      'ặ',
      'â',
      'ấ',
      'ầ',
      'ẩ',
      'ẫ',
      'ậ',
      'ā',
      'ą',
      'å',
      'α',
      'ά',
      'ἀ',
      'ἁ',
      'ἂ',
      'ἃ',
      'ἄ',
      'ἅ',
      'ἆ',
      'ἇ',
      'ᾀ',
      'ᾁ',
      'ᾂ',
      'ᾃ',
      'ᾄ',
      'ᾅ',
      'ᾆ',
      'ᾇ',
      'ὰ',
      'ά',
      'ᾰ',
      'ᾱ',
      'ᾲ',
      'ᾳ',
      'ᾴ',
      'ᾶ',
      'ᾷ',
      'а',
      'أ',
      'အ',
      'ာ',
      'ါ',
      'ǻ',
      'ǎ',
      'ª',
      'ა',
      'अ',
      'ا',
      'ａ',
      'ä',
    ],
    b: ['б', 'β', 'ب', 'ဗ', 'ბ', 'ｂ'],
    c: ['ç', 'ć', 'č', 'ĉ', 'ċ', 'ｃ'],
    d: [
      'ď',
      'ð',
      'đ',
      'ƌ',
      'ȡ',
      'ɖ',
      'ɗ',
      'ᵭ',
      'ᶁ',
      'ᶑ',
      'д',
      'δ',
      'د',
      'ض',
      'ဍ',
      'ဒ',
      'დ',
      'ｄ',
    ],
    e: [
      'é',
      'è',
      'ẻ',
      'ẽ',
      'ẹ',
      'ê',
      'ế',
      'ề',
      'ể',
      'ễ',
      'ệ',
      'ë',
      'ē',
      'ę',
      'ě',
      'ĕ',
      'ė',
      'ε',
      'έ',
      'ἐ',
      'ἑ',
      'ἒ',
      'ἓ',
      'ἔ',
      'ἕ',
      'ὲ',
      'έ',
      'е',
      'ё',
      'э',
      'є',
      'ə',
      'ဧ',
      'ေ',
      'ဲ',
      'ე',
      'ए',
      'إ',
      'ئ',
      'ｅ',
    ],
    f: ['ф', 'φ', 'ف', 'ƒ', 'ფ', 'ｆ'],
    g: ['ĝ', 'ğ', 'ġ', 'ģ', 'г', 'ґ', 'γ', 'ဂ', 'გ', 'گ', 'ｇ'],
    h: ['ĥ', 'ħ', 'η', 'ή', 'ح', 'ه', 'ဟ', 'ှ', 'ჰ', 'ｈ'],
    i: [
      'í',
      'ì',
      'ỉ',
      'ĩ',
      'ị',
      'î',
      'ï',
      'ī',
      'ĭ',
      'į',
      'ı',
      'ι',
      'ί',
      'ϊ',
      'ΐ',
      'ἰ',
      'ἱ',
      'ἲ',
      'ἳ',
      'ἴ',
      'ἵ',
      'ἶ',
      'ἷ',
      'ὶ',
      'ί',
      'ῐ',
      'ῑ',
      'ῒ',
      'ΐ',
      'ῖ',
      'ῗ',
      'і',
      'ї',
      'и',
      'ဣ',
      'ိ',
      'ီ',
      'ည်',
      'ǐ',
      'ი',
      'इ',
      'ی',
      'ｉ',
    ],
    j: ['ĵ', 'ј', 'Ј', 'ჯ', 'ج', 'ｊ'],
    k: ['ķ', 'ĸ', 'к', 'κ', 'Ķ', 'ق', 'ك', 'က', 'კ', 'ქ', 'ک', 'ｋ'],
    l: ['ł', 'ľ', 'ĺ', 'ļ', 'ŀ', 'л', 'λ', 'ل', 'လ', 'ლ', 'ｌ'],
    m: ['м', 'μ', 'م', 'မ', 'მ', 'ｍ'],
    n: ['ñ', 'ń', 'ň', 'ņ', 'ŉ', 'ŋ', 'ν', 'н', 'ن', 'န', 'ნ', 'ｎ'],
    o: [
      'ó',
      'ò',
      'ỏ',
      'õ',
      'ọ',
      'ô',
      'ố',
      'ồ',
      'ổ',
      'ỗ',
      'ộ',
      'ơ',
      'ớ',
      'ờ',
      'ở',
      'ỡ',
      'ợ',
      'ø',
      'ō',
      'ő',
      'ŏ',
      'ο',
      'ὀ',
      'ὁ',
      'ὂ',
      'ὃ',
      'ὄ',
      'ὅ',
      'ὸ',
      'ό',
      'о',
      'و',
      'θ',
      'ို',
      'ǒ',
      'ǿ',
      'º',
      'ო',
      'ओ',
      'ｏ',
      'ö',
    ],
    p: ['п', 'π', 'ပ', 'პ', 'پ', 'ｐ'],
    q: ['ყ', 'ｑ'],
    r: ['ŕ', 'ř', 'ŗ', 'р', 'ρ', 'ر', 'რ', 'ｒ'],
    s: ['ś', 'š', 'ş', 'с', 'σ', 'ș', 'ς', 'س', 'ص', 'စ', 'ſ', 'ს', 'ｓ'],
    t: ['ť', 'ţ', 'т', 'τ', 'ț', 'ت', 'ط', 'ဋ', 'တ', 'ŧ', 'თ', 'ტ', 'ｔ'],
    u: [
      'ú',
      'ù',
      'ủ',
      'ũ',
      'ụ',
      'ư',
      'ứ',
      'ừ',
      'ử',
      'ữ',
      'ự',
      'û',
      'ū',
      'ů',
      'ű',
      'ŭ',
      'ų',
      'µ',
      'у',
      'ဉ',
      'ု',
      'ူ',
      'ǔ',
      'ǖ',
      'ǘ',
      'ǚ',
      'ǜ',
      'უ',
      'उ',
      'ｕ',
      'ў',
      'ü',
    ],
    v: ['в', 'ვ', 'ϐ', 'ｖ'],
    w: ['ŵ', 'ω', 'ώ', 'ဝ', 'ွ', 'ｗ'],
    x: ['χ', 'ξ', 'ｘ'],
    y: [
      'ý',
      'ỳ',
      'ỷ',
      'ỹ',
      'ỵ',
      'ÿ',
      'ŷ',
      'й',
      'ы',
      'υ',
      'ϋ',
      'ύ',
      'ΰ',
      'ي',
      'ယ',
      'ｙ',
    ],
    z: ['ź', 'ž', 'ż', 'з', 'ζ', 'ز', 'ဇ', 'ზ', 'ｚ'],
    aa: ['ع', 'आ', 'آ'],
    ae: ['æ', 'ǽ'],
    ai: ['ऐ'],
    ch: ['ч', 'ჩ', 'ჭ', 'چ'],
    dj: ['ђ', 'đ'],
    dz: ['џ', 'ძ'],
    ei: ['ऍ'],
    gh: ['غ', 'ღ'],
    ii: ['ई'],
    ij: ['ĳ'],
    kh: ['х', 'خ', 'ხ'],
    lj: ['љ'],
    nj: ['њ'],
    oe: ['ö', 'œ', 'ؤ'],
    oi: ['ऑ'],
    oii: ['ऒ'],
    ps: ['ψ'],
    sh: ['ш', 'შ', 'ش'],
    shch: ['щ'],
    ss: ['ß'],
    sx: ['ŝ'],
    th: ['þ', 'ϑ', 'ث', 'ذ', 'ظ'],
    ts: ['ц', 'ც', 'წ'],
    ue: ['ü'],
    uu: ['ऊ'],
    ya: ['я'],
    yu: ['ю'],
    zh: ['ж', 'ჟ', 'ژ'],
    '(c)': ['©'],
    A: [
      'Á',
      'À',
      'Ả',
      'Ã',
      'Ạ',
      'Ă',
      'Ắ',
      'Ằ',
      'Ẳ',
      'Ẵ',
      'Ặ',
      'Â',
      'Ấ',
      'Ầ',
      'Ẩ',
      'Ẫ',
      'Ậ',
      'Å',
      'Ā',
      'Ą',
      'Α',
      'Ά',
      'Ἀ',
      'Ἁ',
      'Ἂ',
      'Ἃ',
      'Ἄ',
      'Ἅ',
      'Ἆ',
      'Ἇ',
      'ᾈ',
      'ᾉ',
      'ᾊ',
      'ᾋ',
      'ᾌ',
      'ᾍ',
      'ᾎ',
      'ᾏ',
      'Ᾰ',
      'Ᾱ',
      'Ὰ',
      'Ά',
      'ᾼ',
      'А',
      'Ǻ',
      'Ǎ',
      'Ａ',
      'Ä',
    ],
    B: ['Б', 'Β', 'ब', 'Ｂ'],
    C: ['Ç', 'Ć', 'Č', 'Ĉ', 'Ċ', 'Ｃ'],
    D: ['Ď', 'Ð', 'Đ', 'Ɖ', 'Ɗ', 'Ƌ', 'ᴅ', 'ᴆ', 'Д', 'Δ', 'Ｄ'],
    E: [
      'É',
      'È',
      'Ẻ',
      'Ẽ',
      'Ẹ',
      'Ê',
      'Ế',
      'Ề',
      'Ể',
      'Ễ',
      'Ệ',
      'Ë',
      'Ē',
      'Ę',
      'Ě',
      'Ĕ',
      'Ė',
      'Ε',
      'Έ',
      'Ἐ',
      'Ἑ',
      'Ἒ',
      'Ἓ',
      'Ἔ',
      'Ἕ',
      'Έ',
      'Ὲ',
      'Е',
      'Ё',
      'Э',
      'Є',
      'Ə',
      'Ｅ',
    ],
    F: ['Ф', 'Φ', 'Ｆ'],
    G: ['Ğ', 'Ġ', 'Ģ', 'Г', 'Ґ', 'Γ', 'Ｇ'],
    H: ['Η', 'Ή', 'Ħ', 'Ｈ'],
    I: [
      'Í',
      'Ì',
      'Ỉ',
      'Ĩ',
      'Ị',
      'Î',
      'Ï',
      'Ī',
      'Ĭ',
      'Į',
      'İ',
      'Ι',
      'Ί',
      'Ϊ',
      'Ἰ',
      'Ἱ',
      'Ἳ',
      'Ἴ',
      'Ἵ',
      'Ἶ',
      'Ἷ',
      'Ῐ',
      'Ῑ',
      'Ὶ',
      'Ί',
      'И',
      'І',
      'Ї',
      'Ǐ',
      'ϒ',
      'Ｉ',
    ],
    J: ['Ｊ'],
    K: ['К', 'Κ', 'Ｋ'],
    L: ['Ĺ', 'Ł', 'Л', 'Λ', 'Ļ', 'Ľ', 'Ŀ', 'ल', 'Ｌ'],
    M: ['М', 'Μ', 'Ｍ'],
    N: ['Ń', 'Ñ', 'Ň', 'Ņ', 'Ŋ', 'Н', 'Ν', 'Ｎ'],
    O: [
      'Ó',
      'Ò',
      'Ỏ',
      'Õ',
      'Ọ',
      'Ô',
      'Ố',
      'Ồ',
      'Ổ',
      'Ỗ',
      'Ộ',
      'Ơ',
      'Ớ',
      'Ờ',
      'Ở',
      'Ỡ',
      'Ợ',
      'Ø',
      'Ō',
      'Ő',
      'Ŏ',
      'Ο',
      'Ό',
      'Ὀ',
      'Ὁ',
      'Ὂ',
      'Ὃ',
      'Ὄ',
      'Ὅ',
      'Ὸ',
      'Ό',
      'О',
      'Θ',
      'Ө',
      'Ǒ',
      'Ǿ',
      'Ｏ',
      'Ö',
    ],
    P: ['П', 'Π', 'Ｐ'],
    Q: ['Ｑ'],
    R: ['Ř', 'Ŕ', 'Р', 'Ρ', 'Ŗ', 'Ｒ'],
    S: ['Ş', 'Ŝ', 'Ș', 'Š', 'Ś', 'С', 'Σ', 'Ｓ'],
    T: ['Ť', 'Ţ', 'Ŧ', 'Ț', 'Т', 'Τ', 'Ｔ'],
    U: [
      'Ú',
      'Ù',
      'Ủ',
      'Ũ',
      'Ụ',
      'Ư',
      'Ứ',
      'Ừ',
      'Ử',
      'Ữ',
      'Ự',
      'Û',
      'Ū',
      'Ů',
      'Ű',
      'Ŭ',
      'Ų',
      'У',
      'Ǔ',
      'Ǖ',
      'Ǘ',
      'Ǚ',
      'Ǜ',
      'Ｕ',
      'Ў',
      'Ü',
    ],
    V: ['В', 'Ｖ'],
    W: ['Ω', 'Ώ', 'Ŵ', 'Ｗ'],
    X: ['Χ', 'Ξ', 'Ｘ'],
    Y: [
      'Ý',
      'Ỳ',
      'Ỷ',
      'Ỹ',
      'Ỵ',
      'Ÿ',
      'Ῠ',
      'Ῡ',
      'Ὺ',
      'Ύ',
      'Ы',
      'Й',
      'Υ',
      'Ϋ',
      'Ŷ',
      'Ｙ',
    ],
    Z: ['Ź', 'Ž', 'Ż', 'З', 'Ζ', 'Ｚ'],
    AE: ['Æ', 'Ǽ'],
    Ch: ['Ч'],
    Dj: ['Ђ'],
    Dz: ['Џ'],
    Gx: ['Ĝ'],
    Hx: ['Ĥ'],
    Ij: ['Ĳ'],
    Jx: ['Ĵ'],
    Kh: ['Х'],
    Lj: ['Љ'],
    Nj: ['Њ'],
    Oe: ['Œ'],
    Ps: ['Ψ'],
    Sh: ['Ш'],
    Shch: ['Щ'],
    Ss: ['ẞ'],
    Th: ['Þ'],
    Ts: ['Ц'],
    Ya: ['Я'],
    Yu: ['Ю'],
    Zh: ['Ж'],
  };

  Object.keys(swaps).forEach((swap) => {
    swaps[swap].forEach((s) => {
      str = str.replace(new RegExp(s, 'g'), swap);
    });
  });
  return str
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse dashes
    .replace(/^-+/, '') // trim - from start of text
    .replace(/-+$/, '');
};

/**
 * Tạo data breadcrumb
 * @param {location} path
 * @returns array
 */
export const genDataBreadCrumb = (path) => {
  return path
    .split('/')
    .filter(Boolean)
    .map((item, _) => ({ label: item, url: _ === 0 ? '/' + item : item }));
};

/**
 * Tìm cả node con theo key
 * @param {string} key
 * @param {array} root
 */
export const findNode = (key, root) => {
  for (let node of root) {
    if (node.key === key) return node;
    else {
      var i;
      var result = null;
      for (i = 0; result == null && i < node.children.length; i++) {
        result = findNode(key, node.children[i]);
      }
      return result;
    }
  }
};

/**
 *
 * @param {*} list
 * @returns
 */
export const listToTree = (list, children = 'children') => {
  let map = {},
    node,
    roots = [],
    i,
    _list = [...list];

  for (i = 0; i < _list.length; i += 1) {
    map[list[i]?.key] = i;
    _list[i][children] = [];
  }

  for (i = 0; i < _list.length; i += 1) {
    node = _list[i];
    if (node?.parentID !== GUID_NULL) {
      _list[map[node.parentID]][children].push(node);
    } else {
      roots.push(node);
    }
  }

  for (let node of _list) {
    if (!node[children]?.length) node[children] = null;
  }

  return roots;
};

/**
 *
 * @param {*} bytes
 * @param {*} decimals
 * @returns
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 *
 * @param {*} timeout
 * @param {*} func
 * @returns
 */
export const debounce = (timeout = 0, func) => {
  if (!timeout) {
    func && func();
    return;
  }

  let timer;
  return (...args) => {
    if (!timer) {
      func.apply(this, args);
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
    }, timeout);
  };
};

/**
 * Tạo guid
 * @returns
 */
export const uuidv4 = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
};

/**
 * is guid
 * @param {*} value
 * @returns
 */
export const isGuid = (value) => {
  var regex = /[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/i;
  var match = regex.exec(value);
  return match != null;
};

/**
 * Parse json
 * @param {*} json
 */
export const ParseJson = (json) => {
  let res = '';
  try {
    res = JSON.parse(json);
  } catch (error) {}
  return res;
};

/**
 *
 * @param {*} url
 * @param {*} fileName
 */
export const DowloadFile = (url, fileName) => {};

/**
 *
 */
export const genFileNameWithTime = (prefix = 'image') => {
  return prefix + '_' + moment().format('HHmmss_DDMMYYYY');
};

/**
 *
 */
export const isInAdminPage = () => {
  return window.location.pathname.indexOf(PATH_NAME.ADMIN) >= 0;
};

export const DOCUMENT_SECTION = {
  DOCUMENT_NEW: slugify(SECTION_TEXT.DOCUMENT_NEW),
  BORROWED_DOCUMENTS_A_LOT: slugify(SECTION_TEXT.BORROWED_DOCUMENTS_A_LOT),
  E_DOCUMENT_NEW: slugify(SECTION_TEXT.E_DOCUMENT_NEW),
  BORROWED_EDOCUMENTS_A_LOT: slugify(SECTION_TEXT.BORROWED_EDOCUMENTS_A_LOT),
};

/**
 * Lấy text order theo status
 * @param {*} status
 */
export const getOrderStatus = (status) => {
  let statusObject = { label: 'Không xác định', color: '#bbbbbb' };

  switch (status) {
    case RESERVATION_STATUS.LENDING:
      statusObject = { label: 'Đang mượn', color: '#007b7f' };
      break;
    case RESERVATION_STATUS.CANCELED:
      statusObject = { label: 'Yêu cầu bị hủy', color: '#dc3545' };
      break;
    case RESERVATION_STATUS.EXPIRED:
      statusObject = { label: 'Quá hạn trả', color: '#FF8800' };
      break;
    case RESERVATION_STATUS.PENDING:
      statusObject = { label: 'Đang xử lý', color: '#0d47a1' };
      break;
    case RESERVATION_STATUS.RETURNED:
      statusObject = { label: 'Đã trả', color: '#28a745' };
      break;
    case RESERVATION_STATUS.WAITING:
      statusObject = { label: 'Đang yêu cầu', color: '#9933CC' };
      break;
    case RESERVATION_STATUS.NONE:
    default:
      break;
  }

  return statusObject;
};

export const commonFilterTime = [
  {
    label: 'Tuần này',
    from: moment().startOf('week').valueOf(),
    to: moment().add(1, 'weeks').startOf('week').valueOf() - 1,
    value: FILTER_TIME_VALUE.THIS_WEEK,
  },
  {
    label: 'Tuần trước',
    from: moment().subtract(1, 'weeks').startOf('week').valueOf(),
    to: moment().startOf('week').valueOf() - 1,
    value: FILTER_TIME_VALUE.LAST_WEEK,
  },
  {
    label: 'Tháng này',
    from: moment().startOf('month').valueOf(),
    to: moment().add(1, 'months').startOf('month').valueOf() - 1,
    value: FILTER_TIME_VALUE.THIS_MONTH,
  },
  {
    label: 'Tháng trước',
    from: moment().subtract(1, 'months').startOf('month').valueOf(),
    to: moment().startOf('month').valueOf() - 1,
    value: FILTER_TIME_VALUE.LAST_MONTH,
  },
  {
    label: 'Quý này',
    from: moment().quarter(moment().quarter()).startOf('quarter').valueOf(),
    to: moment().quarter(moment().quarter()).endOf('quarter').valueOf(),
    value: FILTER_TIME_VALUE.THIS_QUARTER,
  },
  {
    label: 'Quý trước',
    from: moment()
      .quarter(moment().quarter())
      .subtract(1, 'quarters')
      .startOf('quarter')
      .valueOf(),
    to: moment()
      .quarter(moment().quarter())
      .subtract(1, 'quarters')
      .endOf('quarter')
      .valueOf(),
    value: FILTER_TIME_VALUE.LAST_QUARTER,
  },
  {
    label: 'Năm này',
    from: moment().startOf('year').valueOf(),
    to: moment().add(1, 'years').startOf('year').valueOf() - 1,
    value: FILTER_TIME_VALUE.THIS_YEAR,
  },
  {
    label: 'Năm trước',
    from: moment().subtract(1, 'years').startOf('year').valueOf(),
    to: moment().startOf('year').valueOf() - 1,
    value: FILTER_TIME_VALUE.LAST_YEAR,
  },
  {
    label: 'Tùy chọn',
    from: moment().startOf('day').valueOf(),
    to: moment().endOf('day').valueOf(),
    value: FILTER_TIME_VALUE.OPTION,
  },
];

export const isValidHttpUrl = (text) => {
  let url;

  try {
    url = new URL(text);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
};

export const DROPDOWN_STATUS = [
  { label: 'Tất cả', value: -1 },
  {
    label: 'Đang yêu cầu',
    color: '#9933CC',
    value: RESERVATION_STATUS.WAITING,
  },
  { label: 'Đang mượn', color: '#007b7f', value: RESERVATION_STATUS.LENDING },
  {
    label: 'Đang xử lý',
    color: '#0d47a1',
    value: RESERVATION_STATUS.PENDING,
  },
  { label: 'Đã trả', color: '#28a745', value: RESERVATION_STATUS.RETURNED },
  {
    label: 'Quá hạn trả',
    color: '#FF8800',
    value: RESERVATION_STATUS.EXPIRED,
  },
  {
    label: 'Yêu cầu bị hủy',
    color: '#dc3545',
    value: RESERVATION_STATUS.CANCELED,
  },
];

export const requireRegisterView = (navigate) => {
  return (
    <div className="nodata" style={{ padding: 16 }}>
      Bạn chưa là thành viên của thư viện.
      <a
        onClick={() => {
          navigate('/nguoi-dung?view=tai-khoan');
        }}
        className="nodata__button"
      >
        Đăng ký ngay
      </a>
    </div>
  );
};

export const getMemberTypeText = (type) => {
  let typeText = 'Không xác định';
  switch (type) {
    case MEMBER_TYPE.LECTURER:
      typeText = 'Giảng viên';
      break;
    case MEMBER_TYPE.GUEST:
      typeText = 'Khách';
      break;
    case MEMBER_TYPE.STUDENT:
      typeText = 'Sinh viên';
      break;
  }

  return typeText;
};

export const getCardStatusText = (status) => {
  let typeText = 'Không xác định';
  switch (status) {
    case CARD_STATUS.CONFIRMED:
      typeText = 'Đã xác nhận';
      break;
    case CARD_STATUS.REFUSE_COMFIRM:
      typeText = 'Bị từ chối';
      break;
    case CARD_STATUS.CONFIRMING:
    default:
      typeText = 'Chưa xác nhận';
      break;
  }
  return typeText;
};

/**
 * Xử lý response
 * @param {*} response
 * @returns
 */
export function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if ([401, 403].indexOf(response.status) !== -1) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        //logout
        window.location.reload(true);
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
