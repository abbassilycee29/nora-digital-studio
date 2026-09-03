const SUPABASE_URL =
    "https://hoczkycnopirodzxseyz.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_bKO1SVJnyxI5dN2AdTj7CA_1OhRl4SF";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


const form =
    document.getElementById("registerForm");

const message =
    document.getElementById("message");


form.addEventListener("submit", async function(event) {

    event.preventDefault();


    const teacherName =
        document.getElementById("teacherName").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;


    message.textContent =
        "⏳ جاري إنشاء الحساب...";

    message.style.color = "blue";


    const { data, error } =
        await supabaseClient.auth.signUp({

            email: email,

            password: password,

            options: {

                data: {
                    teacher_name: teacherName
                }

            }

        });


    if (error) {

        console.error(error);

        message.textContent =
            "❌ حدث خطأ: " + error.message;

        message.style.color = "red";

        return;

    }


    if (!data.user) {

        message.textContent =
            "❌ لم يتم إنشاء الحساب.";

        message.style.color = "red";

        return;

    }


    const teacherId =
        data.user.id;


    const teacherLink =
        window.location.origin +
        window.location.pathname.replace(
            "register-teacher.html",
            ""
        ) +
        "?teacher=" +
        encodeURIComponent(teacherId);


    message.innerHTML = `

        <p>
            ✅ تم إنشاء حساب الأستاذ بنجاح
        </p>

        <p>
            🔗 رابط تسجيل التلاميذ الخاص بك:
        </p>

        <input
            type="text"
            id="teacherLink"
            value="${teacherLink}"
            readonly
            style="width:100%;"
        >

        <br><br>

        <button
            type="button"
            id="copyLink"
        >
            📋 نسخ الرابط
        </button>

    `;


    document
        .getElementById("copyLink")
        .addEventListener(
            "click",
            async function() {

                const link =
                    document
                        .getElementById("teacherLink")
                        .value;

                await navigator.clipboard
                    .writeText(link);

                alert("تم نسخ الرابط ✅");

            }
        );

});