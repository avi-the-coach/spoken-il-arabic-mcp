# מסמך איפיון - Spoken IL Arabic MCP Server

## 📖 סקירה כללית

### מטרת הפרויקט
פיתוח MCP Server שמתחבר ל-API של אתר "ערבית מדוברת פלסטינית" (roadtorecovery.org.il/Spokenarabic) ומספק כלים לחיפוש שורשים והטיות פעלים בערבית פלסטינית.

### רקע טכני
האתר מספק מילון דיגיטלי לערבית פלסטינית מדוברת עם מערכת הטיות מתקדמת. במהלך המחקר התגלה ש:
- האתר משתמש ב-API REST פשוט
- יש שני endpoints עיקריים: רשימת שורשים וקבלת הטיות
- הנתונים מוחזרים בפורמט JSON מובנה

## 🔗 פרטי ה-API

### Base URL
```
https://amir-325409.oa.r.appspot.com
```

### Endpoints

#### 1. קבלת כל השורשים
```
GET /all
```
**תגובה:**
```json
{
  "roots": {
    "hebrew": ["ללכת - רוח, פעל 1", "לחזור - רוח, פע֘ל 2", ...],
    "taatik": ["ra7", "roo7", ...]
  },
  "belonging": {...},
  "blessings": {...},
  "proverbs": {...},
  "about": {...}
}
```

#### 2. קבלת הטיות לשורש ספציפי
```
GET /hataiotv2/{root_id}
```
**דוגמה:**
```
GET /hataiotv2/ללכת - רוח, פעל 1
```

**תגובה:**
```json
{
  "root": {
    "id": "רוח פעל 1",
    "idArb": "روح فعل 1", 
    "shoresh": "רוח",
    "shoreshArabic": "روح",
    "mashmaut": ["ללכת - רוח, פעל 1", "ללכת במובן המטאפורי כמו הלך עליו"],
    "binian": "פעל 1",
    "gizra": "ע\"ו",
    "peula": "רוּחָה",
    "heaarot": "הערות נוספות...",
    "hataiot": [
      {
        "who": "אָנָא",
        "avar": "רֻחֶת",
        "hoveh": "בָּרוּח", 
        "atid": "רָח אָרוּח",
        "zivoi": "",
        "poel": "",
        "paul": "אין בינוני פָּעוּל"
      }
      // המשך הטיות לכל הגופים...
    ]
  },
  "audio": {
    "root": "רוח",
    "binian": "פעל 1",
    "zivoi": "yes",
    "paul": "no", 
    "poal": "yes"
  },
  "sentences": {
    "root": "רוח",
    "binian": "פעל 1",
    "sentences": [
      {
        "usea": "ראח",
        "useh": "הלך",
        "exmpla": "אחפדי ראחו קבל יומין עלא (א)לחדיקה (א)לעאמה",
        "exmplh": "לפני יומיים, נכדיי הלכו לגן הציבורי"
      }
    ]
  }
}
```

## 🛠️ כלי MCP נדרשים

### Tool 1: search_arabic_roots
**תיאור:** חיפוש שורשים לפי משמעות עברית, תעתיק ערבי או דפוס שורש
**פרמטרים:**
- `search_term` (string, required): מונח החיפוש
- `search_type` (enum: "auto", "hebrew", "arabic", default: "auto"): סוג החיפוש
- `limit` (number, default: 10): מספר תוצאות מקסימלי

**פלט:** רשימת שורשים מתאימים

### Tool 2: get_root_conjugation  
**תיאור:** קבלת טבלת הטיות מלאה לשורש ספציפי
**פרמטרים:**
- `root_id` (string, required): מזהה השורש המדויק כפי שמוחזר מהחיפוש
- `include_audio` (boolean, default: true): כולל מידע על קבצי אודיו
- `include_examples` (boolean, default: true): כולל משפטים לדוגמה
- `include_negation` (boolean, default: false): כולל צורות שלילה

**פלט:** נתוני הטיות מובנים (JSON/text) - Claude יעצב אותם בטבלה ברורה

### Tool 3: get_similar_roots
**תיאור:** חיפוש שורשים דומים לפי דפוס או משמעות
**פרמטרים:**
- `root_id` (string, required): שורש ייחוס
- `similarity_type` (enum: "pattern", "meaning", "phonetic"): סוג הדמיון

**פלט:** רשימת שורשים דומים

## 🏗️ מבנה הפרויקט

```
spoken-il-arabic-mcp/
├── README.md
├── package.json
├── tsconfig.json
├── .gitignore
├── LICENSE (MIT)
├── src/
│   ├── index.ts          # Entry point
│   ├── server.ts         # MCP Server implementation
│   ├── api/
│   │   └── client.ts     # API client for roadtorecovery
│   ├── tools/
│   │   ├── search.ts     # Search implementation
│   │   ├── conjugate.ts  # Conjugation implementation
│   │   └── similar.ts    # Similar roots implementation
│   ├── types/
│   │   └── api.ts        # TypeScript interfaces
│   └── utils/
│       ├── formatter.ts  # Text formatting utilities
│       └── validator.ts  # Input validation
├── dist/                 # Compiled output
├── examples/
│   └── usage.md          # Usage examples
└── docs/
    └── api.md            # API documentation
```

## 📦 Dependencies

### Runtime Dependencies
- `@modelcontextprotocol/sdk`: MCP SDK
- `node-fetch`: HTTP requests (if not using built-in fetch)

### Development Dependencies
- `typescript`: TypeScript compiler
- `@types/node`: Node.js type definitions
- `ts-node`: TypeScript execution
- `nodemon`: Development server

## 🎨 הערות על תצוגה

**חשוב:** MCP Server מחזיר נתונים גולמיים בלבד. Claude יהיה אחראי על:
- עיצוב הטבלאות והתצוגה
- ארגון המידע בצורה ברורה  
- התאמת הפורמט לשאלת המשתמש
- הצגת המידע בעברית/ערבית בצורה נכונה

## 🛡️ דרישות טכניות

### Error Handling
- טיפול ב-HTTP errors (404, 500, וכו')
- Validation של פרמטרי קלט
- הודעות שגיאה ברורות למשתמש

### Performance
- Caching של תוצאות (אופציונלי בשלב ראשון)
- Rate limiting כדי לא להעמיס על השרת
- Timeout handling לבקשות HTTP

### Security
- Input sanitization
- הגנה מפני injection attacks
- Safe URL encoding

## 📝 דוגמאות שימוש

### חיפוש בסיסי
```
User: "חפש את השורש רוח"
Tool: search_arabic_roots("רוח")
Result: ["ללכת - רוח, פעל 1", "לחזור - רוח, פע֘ל 2", ...]
```

### קבלת הטיות
```
User: "תן לי הטיות לשורש ללכת - רוח, פעל 1"
Tool: get_root_conjugation("ללכת - רוח, פעל 1")
Result: טבלת הטיות מלאה
```

## ✅ הגדרת הצלחה

הפרויקט יחשב מוצלח כאשר:
1. ✅ ניתן להתקין via `npm install -g spoken-il-arabic-mcp`
2. ✅ Claude יכול להשתמש בכל שלושת הכלים
3. ✅ חיפוש שורשים עובד באופן אמין
4. ✅ הטיות מוצגות בצורה ברורה וקריאה
5. ✅ הטיפול בשגיאות עובד כמו שצריך
6. ✅ התיעוד מלא ובהיר

## 🚀 שלבי פיתוח

### Phase 1: MVP
1. מבנה פרויקט בסיסי
2. חיבור ל-API
3. כלי חיפוש בסיסי
4. כלי הטיות בסיסי

### Phase 2: שיפורים
1. עיצוב פלט משופר
2. טיפול בשגיאות מתקדם
3. כלי שורשים דומים
4. תיעוד מלא

### Phase 3: אופטימיזציה
1. Caching
2. Performance improvements
3. Additional features
4. Community feedback integration

## 📞 מידע ליצירת קשר

- **Developer**: Claude (Anthropic) & אבי בכר (GitHub collaborator)  
- **Repository**: https://github.com/avi-the-coach/spoken-il-arabic-mcp
- **License**: MIT
- **API Source**: roadtorecovery.org.il/Spokenarabic

---

*מסמך זה נכתב בתאריך [DATE] ומבוסס על מחקר מעמיק של ה-API ודרישות המשתמשים.*