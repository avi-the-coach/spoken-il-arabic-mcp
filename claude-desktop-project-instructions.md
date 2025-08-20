# הנחיות ליצירת דפי שורשים ערביים

## סקירה כללית

כאשר משתמש מבקש ליצור דף לפועל עברי (לדוגמה: "תביא לי את הדף למילה: למכור"), יש לעקוב אחר התהליך המפורט הבא ליצירת דף שורש ערבי מעוצב ומלא.

## דגשים חשובים

⚠️ **חשוב מאוד**: אנו עובדים עם **ערבית פלסטינית מדוברת** ולא עם ערבית ספרותית!

## התהליך המלא

### שלב 1: זיהוי שפת החיפוש

**אין צורך לנחש או לחשוב על שורשים!** פשוט זהה באיזו שפה המילה שקיבלת:

- **אם המילה בעברית** (למכור, ללמוד, הולך) → חפש בעברית
- **אם המילה בערבית** (ביע, עלמ, משי) → חפש בערבית

### שלב 2: חיפוש השורש במערכת

השתמש בכלי `search_arabic_roots` לפי השפה שזיהית:

**אם המילה בעברית:**
```
search_arabic_roots(
    search_term="למכור",
    search_type="hebrew"
)
```

**אם המילה בערבית:**
```
search_arabic_roots(
    search_term="ביע",
    search_type="arabic"
)
```

**טיפים לחיפוש:**
- אם לא נמצאה תוצאה, נסה וריאציות של המילה (בעברית: למכור/מוכר/מכירה, בערבית: עם או בלי ניקוד)
- בחר את השורש הבסיסי (בדרך כלל פעל 1) אלא אם יש סיבה מיוחדת אחרת
- אם עדיין לא נמצא, נסה את השפה השנייה (אם חיפשת בעברית, נסה בערבית ולהיפך)

### שלב 3: קבלת נתונים מלאים

השתמש בכלי `get_root_conjugation` עם ה-ID המדויק שנמצא:

```
get_root_conjugation(
    root_id="ביע פעל 1"
)
```

### שלב 4: יצירת הדף המעוצב

צור דף HTML באמצעות התבנית המעוצבת. הדף כולל:

**מבנה הדף:**
1. **כותרת עליונה** - שורש עברי + ערבי + משמעות
2. **מידע בסיסי** - בנין, גזרה, דפוס, ID
3. **ביטוי מיוחד** (אם קיים) - quote box עם הערות מיוחדות
4. **צורות פועל/פעול** - 4 כרטיסים (פועל זכר/נקבה, פעול זכר/נקבה)
5. **טבלת הטיות חיובית** - כל הגופים והזמנים בצורה חיובית
6. **טבלת הטיות שלילית** - כל הגופים והזמנים בצורה שלילית  
7. **דוגמאות שימוש** (אם קיימות) - משפטי דוגמה בערבית ועברית
8. **הערות דקדוקיות** (אם נדרשות) - הסברים על הגזרה ושינויים
9. **ביטויים/שורשים קרובים** (אם קיימים) - תוכן נוסף רלוונטי
10. **פוטר** - קרדיטים ולינקים

**תכונות חשובות:**
- **שתי טבלאות הטיות** - אחת לחיוב ואחת לשלילה (משתמש בשדות `avar`/`avarS`, `hoveh`/`hovehS` וכו')
- **עיצוב נקי** - שחור על לבן עם טאצ' סגול עדין
- **קומפקטיות** - מידע צפוף ללא בזבוז מקום
- **נגישות** - פונטים ברורים וצבעים מובחנים

## התבנית הסטנדרטית

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>שורש ערבי: [שורש] ([משמעות])</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Assistant', 'Segoe UI', Tahoma, sans-serif;
            background: #fafafa;
            color: #1a1a1a;
            line-height: 1.4;
            padding: 15px;
        }
        
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            overflow: hidden;
            border: 1px solid #e5e5e5;
        }
        
        .header {
            background: white;
            padding: 20px 25px 15px;
            border-bottom: 2px solid #8b5cf6;
            position: relative;
        }
        
        .header::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, #8b5cf6, transparent);
            filter: blur(0.5px);
        }
        
        .root-main {
            display: flex;
            align-items: baseline;
            gap: 15px;
            margin-bottom: 8px;
        }
        
        .root-title {
            font-size: 2.2rem;
            font-weight: 700;
            color: #1a1a1a;
            text-shadow: 0 1px 2px rgba(139, 92, 246, 0.1);
        }
        
        .root-arabic {
            font-size: 1.8rem;
            color: #6b7280;
            font-weight: 400;
        }
        
        .meaning {
            font-size: 1rem;
            color: #8b5cf6;
            font-weight: 500;
        }
        
        .content {
            padding: 20px 25px;
        }
        
        .info-section {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 12px;
            margin-bottom: 20px;
            padding: 15px;
            background: #f8fafc;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
        }
        
        .info-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .info-label {
            font-weight: 600;
            color: #374151;
            font-size: 0.9rem;
            min-width: 60px;
        }
        
        .info-value {
            color: #1f2937;
            font-size: 0.95rem;
        }
        
        .section-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: #1a1a1a;
            margin: 25px 0 12px 0;
            padding-bottom: 6px;
            border-bottom: 1px solid #8b5cf6;
            position: relative;
        }
        
        .section-title::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 40px;
            height: 2px;
            background: #8b5cf6;
            border-radius: 1px;
        }
        
        .verb-forms {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 10px;
            margin: 15px 0;
        }
        
        .verb-card {
            text-align: center;
            padding: 10px 8px;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            background: white;
            transition: all 0.2s ease;
        }
        
        .verb-card:hover {
            border-color: #8b5cf6;
            box-shadow: 0 2px 4px rgba(139, 92, 246, 0.1);
        }
        
        .verb-type {
            font-size: 0.75rem;
            color: #6b7280;
            margin-bottom: 4px;
            font-weight: 500;
        }
        
        .verb-form {
            font-size: 1.1rem;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 2px;
        }
        
        .verb-meaning {
            font-size: 0.8rem;
            color: #8b5cf6;
            font-weight: 500;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 0.9rem;
        }
        
        th {
            background: #f8fafc;
            color: #374151;
            padding: 8px 10px;
            text-align: center;
            font-weight: 600;
            border: 1px solid #e2e8f0;
            font-size: 0.85rem;
        }
        
        td {
            padding: 6px 10px;
            text-align: center;
            border: 1px solid #e2e8f0;
            transition: background 0.2s ease;
        }
        
        tr:nth-child(even) {
            background: #f9fafb;
        }
        
        tr:hover {
            background: #f3f4f6;
        }
        
        .person-label {
            text-align: right !important;
            font-weight: 600;
            color: #374151;
            background: #f1f5f9 !important;
            font-size: 0.85rem;
        }
        
        .examples {
            background: #f8fafc;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            border: 1px solid #e2e8f0;
        }
        
        .example-item {
            margin: 8px 0;
            padding: 8px;
            background: white;
            border-radius: 4px;
            border-right: 3px solid #8b5cf6;
        }
        
        .example-arabic {
            font-size: 1rem;
            color: #1a1a1a;
            margin-bottom: 4px;
            font-weight: 500;
        }
        
        .example-hebrew {
            color: #6b7280;
            font-size: 0.9rem;
            font-style: italic;
        }
        
        .quote-box {
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
            color: white;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            text-align: center;
            box-shadow: 0 2px 8px rgba(139, 92, 246, 0.2);
        }
        
        .quote-arabic {
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 6px;
        }
        
        .quote-hebrew {
            font-size: 0.9rem;
            opacity: 0.9;
        }
        
        .expressions {
            background: #f8fafc;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            border: 1px solid #e2e8f0;
        }
        
        .expression-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 8px;
        }
        
        .expression-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 8px;
            background: white;
            border-radius: 4px;
            border: 1px solid #e2e8f0;
        }
        
        .expression-arabic {
            font-weight: 600;
            color: #1a1a1a;
            font-size: 0.9rem;
            min-width: 80px;
        }
        
        .expression-hebrew {
            color: #6b7280;
            font-size: 0.85rem;
        }
        
        .note-box {
            background: #fef7ff;
            border: 1px solid #e879f9;
            border-radius: 6px;
            padding: 12px;
            margin: 20px 0;
        }
        
        .note-title {
            font-weight: 600;
            color: #a21caf;
            margin-bottom: 6px;
            font-size: 0.9rem;
        }
        
        .note-text {
            color: #374151;
            font-size: 0.85rem;
            line-height: 1.5;
        }
        
        .footer {
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            padding: 12px 25px;
            margin-top: 20px;
        }
        
        .footer-content {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            flex-wrap: wrap;
            font-size: 0.8rem;
            color: #6b7280;
        }
        
        .credit-item {
            display: flex;
            align-items: center;
            gap: 4px;
        }
        
        .credit-text {
            color: #6b7280;
        }
        
        .credit-link {
            color: #8b5cf6;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.2s ease;
            border-bottom: 1px solid transparent;
        }
        
        .credit-link:hover {
            color: #7c3aed;
            border-bottom-color: #7c3aed;
        }
        
        .separator {
            color: #d1d5db;
            font-weight: 300;
        }
        
        @media (max-width: 600px) {
            .footer-content {
                flex-direction: column;
                gap: 6px;
                text-align: center;
            }
            
            .separator {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="root-main">
                <h1 class="root-title">[השורש_העברי]</h1>
                <div class="root-arabic">[השורש_הערבי]</div>
            </div>
            <div class="meaning">[המשמעות]</div>
        </div>
        
        <div class="content">
            <div class="info-section">
                <div class="info-item">
                    <span class="info-label">בנין:</span>
                    <span class="info-value">[בנין_ופעולה]</span>
                </div>
                <div class="info-item">
                    <span class="info-label">גזרה:</span>
                    <span class="info-value">[גזרה]</span>
                </div>
                <div class="info-item">
                    <span class="info-label">דפוס:</span>
                    <span class="info-value">[דפוס_השורש]</span>
                </div>
                <div class="info-item">
                    <span class="info-label">ID:</span>
                    <span class="info-value">[ID_ערבי]</span>
                </div>
            </div>
            
            <!-- אם יש ביטוי מיוחד/הערה, הוסף quote-box -->
            
            <h2 class="section-title">צורות הפועל</h2>
            <div class="verb-forms">
                <div class="verb-card">
                    <div class="verb-type">פועל זכר</div>
                    <div class="verb-form">[פועל_זכר]</div>
                    <div class="verb-meaning">[משמעות]</div>
                </div>
                <div class="verb-card">
                    <div class="verb-type">פועל נקבה</div>
                    <div class="verb-form">[פועל_נקבה]</div>
                    <div class="verb-meaning">[משמעות]</div>
                </div>
                <div class="verb-card">
                    <div class="verb-type">פעול זכר</div>
                    <div class="verb-form">[פעול_זכר]</div>
                    <div class="verb-meaning">[משמעות]</div>
                </div>
                <div class="verb-card">
                    <div class="verb-type">פעול נקבה</div>
                    <div class="verb-form">[פעול_נקבה]</div>
                    <div class="verb-meaning">[משמעות]</div>
                </div>
            </div>
            
            <h2 class="section-title">הטיות - חיוב</h2>
            <table>
                <thead>
                    <tr>
                        <th>גוף</th>
                        <th>עבר</th>
                        <th>הווה</th>
                        <th>עתיד</th>
                        <th>ציווי</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- הכנס את טבלת ההטיות החיוביות מהנתונים -->
                    <!-- השתמש בשדות: avar, hoveh, atid, zivoi -->
                </tbody>
            </table>
            
            <h2 class="section-title">הטיות - שלילה</h2>
            <table>
                <thead>
                    <tr>
                        <th>גוף</th>
                        <th>עבר</th>
                        <th>הווה</th>
                        <th>עתיד</th>
                        <th>ציווי</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- הכנס את טבלת ההטיות השליליות מהנתונים -->
                    <!-- השתמש בשדות: avarS, hovehS, atidS, zivoiS -->
                </tbody>
            </table>
            
            <!-- אם יש דוגמאות, הוסף אותן -->
            
            <!-- אם יש הערות דקדוקיות, הוסף note-box -->
            
            <!-- אם יש ביטויים או שורשים קרובים, הוסף expressions -->
            
        </div>
        
        <div class="footer">
            <div class="footer-content">
                <div class="credit-item">
                    <span class="credit-text">המידע בדף זה מוגש באדיבות האתר</span>
                    <a href="https://roadtorecovery.org.il/Spokenarabic/" target="_blank" class="credit-link">"ערבית מדוברת"</a>
                </div>
                <div class="separator">•</div>
                <div class="credit-item">
                    <span class="credit-text">הדף יוצר ע"י AI באמצעות MCP שזמין</span>
                    <a href="https://github.com/avi-the-coach/spoken-il-arabic-mcp" target="_blank" class="credit-link">בקוד פתוח</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
```

## הנחיות למילוי התבנית

### מידע בסיסי
- **[השורש_העברי]**: השורש בכתב עברי (לדוגמה: "ביע")
- **[השורש_הערבי]**: השורש בכתב ערבי (לדוגמה: "بيع")
- **[המשמעות]**: משמעות השורש (לדוגמה: "למכור")

### מידע טכני
- **[בנין_ופעולה]**: מבנין + הפעולה (לדוגמה: "פעל 1 (בֶּיע)")
- **[גזרה]**: סוג הגזרה (לדוגמה: "ע\"י", "שלמים", "ל\"י")
- **[דפוס_השורש]**: תבנית השורש (לדוגמה: "ב-י-ע")
- **[ID_ערבי]**: המזהה הערבי (לדוגמה: "بيع فعل 1")

### צורות פועל/פעול
הכנס את הצורות מהנתונים שהתקבלו:
- פועל זכר/נקבה (מי שמבצע את הפעולה)
- פעול זכר/נקבה (מושא הפעולה)

### טבלאות הטיות
מלא **שתי טבלאות נפרדות** עם הגופים:
- אנא, אנתא, אנתי, הוּוֶ, הִייֶ, אחנא, אנתו, הומה

**טבלה ראשונה - חיוב:**
- עבר (`avar`), הווה (`hoveh`), עתיד (`atid`), ציווי (`zivoi`)

**טבלה שנייה - שלילה:**  
- עבר (`avarS`), הווה (`hovehS`), עתיד (`atidS`), ציווי (`zivoiS`)

דוגמה:
- **חיובי:** "בְּתִמְשִי" (אתה הולך)
- **שלילי:** "מָא בְּתִמְשִיש" (אתה לא הולך)

### תוכן נוסף (לפי זמינות)
- **Quote Box**: אם יש ביטוי מיוחד או הערה במידע
- **דוגמאות**: אם יש משפטי דוגמה
- **Note Box**: להערות דקדוקיות חשובות
- **Expressions**: לביטויים נוספים או שורשים קרובים

## דוגמה מלאה

### בקשת משתמש:
"תביא לי את הדף למילה: הולך"

### התהליך:
1. **זיהוי שפה**: הולך → עברית
2. **חיפוש**: `search_arabic_roots("הולך", "hebrew")` או `search_arabic_roots("ללכת", "hebrew")`
3. **נתונים**: `get_root_conjugation("ללכת - משי, פעל 1")`
4. **יצירה**: דף HTML עם כל המידע

### תוצאה:
דף מעוצב ומלא עם:
- שורש "משי" (مشي) - ללכת
- צורות פועל ופעול
- **שתי טבלאות הטיות** - חיוב ושלילה
- ביטוי מיוחד ("הורג את ההרוג והולך ללוויה שלו")
- הערה דקדוקית על גזרת ל"י
- שורשים דומים (רוח, סיר)

## טיפים נוספים

- **חיפוש גמיש**: המערכת תומכת בחיפוש הן בעברית והן בערבית - השתמש בשפה שהמשתמש נתן
- **בעיות חיפוש**: אם לא נמצא בשפה אחת, נסה בשפה השנייה
- **בחירת שורש**: העדף פעל 1 אלא אם יש סיבה מיוחדת
- **איכות תוכן**: ודא שהמשמעות מתאימה למילה המבוקשת
- **עקביות**: השתמש תמיד באותה תבנית ועיצוב
- **פוטר**: ודא שהלינקים בפוטר נכונים ועובדים

## קבצי עזר

- התבנית הסטנדרטית שמורה כ-artifact
- דוגמאות לשורשים שונים זמינות במאגר
- תיעוד טכני זמין ב-GitHub