
/* ==================================================
   1. تحديد عناصر HTML التي سنتعامل معها
   ================================================== */

// تحديد زر فتح وإغلاق القائمة باستخدام اسم الصنف menu-toggle
const menuButton = document.querySelector(".menu-toggle");

// تحديد عنصر قائمة التنقل
const navigation = document.querySelector(".site-nav");

// تحديد جميع الروابط الموجودة داخل قائمة التنقل
// querySelectorAll تعيد مجموعة من العناصر، وليس عنصرًا واحدًا
const navLinks = document.querySelectorAll(".nav-link");

// تحديد جميع الأقسام داخل main التي تحتوي على id
// مثل: home وlessons وabout
const sections = document.querySelectorAll("main section[id]");


/* ==================================================
   2. دالة فتح القائمة وإغلاقها
   ================================================== */

function setMenuOpen(isOpen) {

    // إذا كانت isOpen تساوي true تتم إضافة is-open
    // وإذا كانت false تتم إزالة is-open
    // CSS يستخدم هذا الصنف لإظهار القائمة أو إخفائها
    navigation.classList.toggle("is-open", isOpen);

    // تحديث حالة القائمة لقارئات الشاشة
    // نحول القيمة المنطقية إلى نص: "true" أو "false"
    menuButton.setAttribute("aria-expanded", String(isOpen));

    // تحديث الوصف الصوتي للزر حسب الحالة
    // إذا كانت القائمة مفتوحة، فالزر سيغلقها
    // وإذا كانت مغلقة، فالزر سيفتحها
    menuButton.setAttribute(
        "aria-label",
        isOpen ? "إغلاق القائمة" : "فتح القائمة"
    );
}


/* ==================================================
   3. فتح القائمة وإغلاقها عند الضغط على الزر
   ================================================== */

// إضافة مستمع حدث click إلى زر القائمة
menuButton.addEventListener("click", () => {

    // قراءة الحالة الحالية للقائمة من aria-expanded
    // المقارنة === "true" تعيد true إذا كانت القيمة النصية "true"
    const isOpen =
        menuButton.getAttribute("aria-expanded") === "true";

    // عكس الحالة الحالية:
    // إذا كانت مفتوحة نغلقها، وإذا كانت مغلقة نفتحها
    setMenuOpen(!isOpen);
});


/* ==================================================
   4. إغلاق القائمة عند الضغط على أحد الروابط
   ================================================== */

// المرور على جميع روابط القائمة واحدًا تلو الآخر
navLinks.forEach((link) => {

    // إضافة حدث الضغط إلى كل رابط
    link.addEventListener("click", () => {

        // إغلاق القائمة بعد الضغط على أي رابط
        setMenuOpen(false);
    });
});


/* ==================================================
   5. إغلاق القائمة عند الضغط على زر Escape
   ================================================== */

// الاستماع إلى أحداث لوحة المفاتيح في المستند
document.addEventListener("keydown", (event) => {

    // التحقق من أن المفتاح المضغوط هو Escape
    if (event.key === "Escape") {

        // إغلاق القائمة
        setMenuOpen(false);

        // إعادة تركيز لوحة المفاتيح إلى زر القائمة
        menuButton.focus();
    }
});


/* ==================================================
   6. إغلاق القائمة عند الضغط خارجها
   ================================================== */

// الاستماع إلى جميع نقرات المستند
document.addEventListener("click", (event) => {

    // إذا كانت القائمة مغلقة، فلا حاجة لتنفيذ بقية الكود
    // return تنهي تنفيذ هذه الدالة في هذه الحالة
    if (menuButton.getAttribute("aria-expanded") !== "true") {
        return;
    }

    // التحقق مما إذا كان مكان النقر داخل القائمة
    // event.target هو العنصر الذي نقر عليه المستخدم
    const clickedInsideMenu = navigation.contains(event.target);

    // التحقق مما إذا كان النقر داخل زر فتح القائمة
    const clickedButton = menuButton.contains(event.target);

    // إذا كان النقر خارج القائمة وخارج الزر
    if (!clickedInsideMenu && !clickedButton) {

        // إغلاق القائمة
        setMenuOpen(false);
    }
});


/* ==================================================
   7. تحديد رابط القسم الحالي
   ================================================== */

function setCurrentLink(sectionId) {

    // المرور على جميع روابط التنقل
    navLinks.forEach((link) => {

        // مقارنة href الخاص بالرابط مع معرّف القسم
        // مثال: href="#lessons" مع sectionId يساوي "lessons"
        const isCurrent =
            link.getAttribute("href") === `#${sectionId}`;

        // إذا كان الرابط يطابق القسم الحالي
        if (isCurrent) {

            // وضع خاصية aria-current عليه
            // حتى يمكن تمييز الرابط الحالي وإفادة التقنيات المساعدة
            link.setAttribute("aria-current", "location");

        } else {

            // إزالة الخاصية من الروابط الأخرى
            link.removeAttribute("aria-current");
        }
    });
}


/* ==================================================
   8. مراقبة الأقسام أثناء التمرير
   ================================================== */

// إنشاء مراقب يكتشف دخول الأقسام إلى منطقة الرؤية
const sectionObserver = new IntersectionObserver(

    // تُنفذ هذه الدالة عندما تتغير حالة ظهور الأقسام
    (entries) => {

        // الاحتفاظ بالأقسام التي تتقاطع مع منطقة المراقبة
        // ثم ترتيبها من الأعلى نسبة ظهورًا إلى الأقل
        // [0] تعني اختيار أول عنصر بعد الترتيب
        const visibleSection = entries
            .filter((entry) => entry.isIntersecting)
            .sort(
                (a, b) =>
                    b.intersectionRatio - a.intersectionRatio
            )[0];

        // إذا وُجد قسم ظاهر ضمن النتائج
        if (visibleSection) {

            // تحديث رابط التنقل ليطابق معرّف القسم الظاهر
            setCurrentLink(visibleSection.target.id);
        }
    },

    // إعدادات مراقبة الأقسام
    {
        // تحديد منطقة المراقبة داخل نافذة العرض
        // تقليل المنطقة من الأعلى والأسفل لتحديد موضع مناسب
        // لمعرفة القسم الذي وصل إليه المستخدم أثناء التمرير
        rootMargin: "-40% 0px -50% 0px",

        // عتبة 0 تعني السماح بإشعار المراقب عند بدء التقاطع
        threshold: 0,
    }
);


/* ==================================================
   9. تسجيل جميع الأقسام لدى المراقب
   ================================================== */

// المرور على الأقسام التي حددناها في بداية الكود
sections.forEach((section) => {

    // جعل المراقب يتابع القسم الحالي
    sectionObserver.observe(section);
});
