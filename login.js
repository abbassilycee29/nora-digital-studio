const SUPABASE_URL = "https://hoczkycnopirodzxseyz.supabase.co";
const SUPABASE_KEY = "sb_publishable_bKO1SVJnyxI5dN2AdTj7CA_1OhRl4SF";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } =
        await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

    if (error) {

        message.textContent = "❌ "+error.message;
        message.style.color = "red";

    } else {

        message.textContent = "✅ تم تسجيل الدخول";
        message.style.color = "green";

        window.location.href = "teacher.html";
    }

});