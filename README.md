# שאלון מענקים – Google Sheets + Gmail
## ללא שרת · ללא תשלום · ללא תחזוקה

כל מילוי נשמר אוטומטית ב-Google Sheets ומגיע במייל ל-ronench@inno-tech.io.

---

## הגדרה – 3 שלבים בלבד

### שלב 1 – צור Google Sheet חדש

1. פתח https://sheets.google.com וצור גיליון ריק חדש
2. תן לו שם כלשהו, למשל: **"תשובות שאלון מענקים"**
3. שמור את ה-URL של הגיליון (תצטרך אותו בשלב 2)

---

### שלב 2 – הוסף את Apps Script

1. בגיליון: לחץ **Extensions → Apps Script**
2. מחק את כל הקוד הקיים
3. העתק את כל התוכן מקובץ **`Code.gs`** והדבק
4. שמור (Ctrl+S)
5. לחץ **Deploy → New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
6. לחץ **Deploy** → אשר הרשאות
7. **העתק את ה-URL** שמוצג (נראה כך: `https://script.google.com/macros/s/ABC.../exec`)

---

### שלב 3 – עדכן את ה-HTML

פתח את **`index.html`** ועדכן בשורה 3 של ה-`<script>`:

```javascript
var APPS_SCRIPT_URL = "https://script.google.com/macros/s/ABC.../exec";
```

החלף את `YOUR_APPS_SCRIPT_URL_HERE` בכתובת שהעתקת.

---

### שלב 4 – העלה את ה-HTML לאינטרנט

**אפשרות א׳ – GitHub Pages (חינמי):**
1. צור repo חדש ב-GitHub
2. העלה את `index.html`
3. Settings → Pages → Branch: main → Save
4. הקובץ זמין בכתובת: `https://USERNAME.github.io/REPO/`

**אפשרות ב׳ – Netlify (חינמי, קל יותר):**
1. עבור ל-https://netlify.com
2. גרור את `index.html` לאזור ה-Drop
3. מקבל URL מיידית

**אפשרות ג׳ – כל אחסון אחר**
קובץ HTML סטטי רגיל — עובד בכל מקום.

---

## מה קורה כשמגיעה תשובה?

1. **Google Sheets** — שורה חדשה נוספת אוטומטית עם כל הפרטים + תאריך ושעה
2. **מייל** — נשלח ל-ronench@inno-tech.io עם כל התשובות בפורמט נוח

---

## עדכון כתובת המייל

בקובץ `Code.gs`, שורה 2:
```javascript
var TO_EMAIL = "ronench@inno-tech.io";
```

---

## פתרון בעיות

**"Authorization required"** — חזור על שלב Deploy ואשר הרשאות מחדש

**לא מגיע מייל** — ודא שה-Apps Script רץ מהחשבון הנכון ויש לו הרשאת Gmail

**CORS error** — Apps Script דורש `fetch` ללא CORS headers — הקוד כבר מוגדר נכון
