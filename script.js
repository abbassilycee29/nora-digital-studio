
const SUPABASE_URL = "https://hoczkycnopirodzxseyz.supabase.co";
const SUPABASE_KEY = "sb_publishable_bKO1SVJnyxI5dN2AdTj7CA_1OhRl4SF";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
async function checkTeacherLogin() {

    const { data: { session } } =
        await supabaseClient.auth.getSession();

    if (!session) {
        window.location.href = "login.html";
    }
}

checkTeacherLogin();

const form = document.getElementById("studentForm");
const submitButton = form.querySelector('button[type="submit"]');
form.addEventListener("submit", async function(event) {

    event.preventDefault();

    // إذا كنا في وضع التعديل
    if (window.editingStudentId) {

        const id = window.editingStudentId;

        const updatedStudent = {
            first_name: document.getElementById("firstName").value,
            last_name: document.getElementById("lastName").value,
            birth_date: document.getElementById("birthDate").value || null,
            birth_place: document.getElementById("birthPlace").value,
            gender: document.getElementById("gender").value,
            school_year: document.getElementById("schoolYear").value,
            branch: document.getElementById("branch").value,
            class_name: document.getElementById("className").value,
            parent_name: document.getElementById("parentName").value,
            parent_phone: document.getElementById("parentPhone").value,
            address: document.getElementById("address").value,
            email: document.getElementById("email").value,
            notes: document.getElementById("notes").value
        };

        const { data, error } = await supabaseClient
            .from("teacher student")
            .update(updatedStudent)
            .eq("id", id)
            .select();

        if (error) {
            alert("خطأ أثناء التعديل:\n" + error.message);
            console.error(error);
            return;
        }

        if (!data || data.length === 0) {
            alert("لم يتم تعديل أي تلميذ.");
            return;
        }

        alert("تم تعديل معلومات التلميذ بنجاح ✅");

        window.editingStudentId = null;
        form.reset();
        submitButton.textContent = "📤 إرسال المعلومات";

        await loadStudents();

        return;
    }

    // تسجيل تلميذ جديد

const { data: { session } } = await supabaseClient.auth.getSession();

if (!session) {
    alert("يجب تسجيل الدخول أولاً");
    return;
}

const teacher_id = session.user.id;

const student = {
    teacher_id: teacher_id,
    status:"accepted",
    first_name: document.getElementById("firstName").value,
    last_name: document.getElementById("lastName").value,
    birth_date: document.getElementById("birthDate").value || null,
    birth_place: document.getElementById("birthPlace").value,
    gender: document.getElementById("gender").value,
    school_year: document.getElementById("schoolYear").value,
    branch: document.getElementById("branch").value,
    class_name: document.getElementById("className").value,
    parent_name: document.getElementById("parentName").value,
    parent_phone: document.getElementById("parentPhone").value,
    address: document.getElementById("address").value,
    email: document.getElementById("email").value,
    notes: document.getElementById("notes").value
};

    const { data:updatedData, error } = await supabaseClient
        .from("teacher student")
        .insert([student]);

    if (error) {
    alert("خطأ التعديل: " + error.message);
    console.error(error);
    return;
}

alert("تم التعديل في قاعدة البيانات ✅");
    

    form.reset();
});
async function loadStudents() {

  const { data: { session } } = await supabaseClient.auth.getSession();

if (!session) {
    window.location.href = "login.html";
    return;
}

const teacher_id = session.user.id;

const { data, error } = await supabaseClient
    .from("teacher student")
    .select("*")
    .eq("teacher_id", teacher_id)
    .eq("status", "accepted")
    .order("created_at", { ascending: false });
if (error) {
    console.error(error);
    alert("تعذر تحميل بيانات التلاميذ:\n" + error.message);
    return;
}

alert("عدد التلاميذ: " + data.length);

    const tableBody = document.querySelector("#studentsTable");

    if (!tableBody) {
        console.log("لم يتم العثور على جدول التلاميذ");
        return;
    }

    tableBody.innerHTML = "";

    data.forEach(function(student, index) {

        const row = document.createElement("tr");

        row.innerHTML = `
    <td>${index + 1}</td>
    <td>${student.last_name || ""}</td>
    <td>${student.first_name || ""}</td>
    <td>${student.birth_date || ""}</td>
    <td>${student.birth_place || ""}</td>
    <td>${student.gender || ""}</td>
<td>${student.school_year || ""}</td>
<td>${student.branch || ""}</td>
<td>${student.class_name || ""}</td>
    <td>${student.parent_name || ""}</td>
    <td>${student.parent_phone || ""}</td>
    <td>${student.address || ""}</td>
    <td>${student.email || ""}</td>
    <td>${student.notes || ""}</td>
    <td>
    <td>
    <td class="actions-cell">
    <button
        type="button"
        onclick="editStudent('${student.id}')">
        ✏️ تغيير
    </button>

    <button
        type="button"
        onclick="deleteStudent('${student.id}')">
        🗑️ حذف
    </button>
</td>
`;

        tableBody.appendChild(row);
    });
 document.getElementById("studentCount").textContent = data.length;
let male = data.filter(student => student.gender === "ذكر").length;
let female = data.filter(student => student.gender === "أنثى").length;

document.getElementById("malecount").textContent = male;
document.getElementById("femalecount").textContent = female;
  }
loadStudents();
// تحميل طلبات تسجيل التلاميذ
async function loadPendingStudents() {

    const { data: { session } } =
        await supabaseClient.auth.getSession();

    if (!session) {
        return;
    }

    const { data, error } = await supabaseClient
        .from("teacher student")
        .select("*")
        .eq("status", "pending")
        .is("teacher_id", null)
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        alert("تعذر تحميل طلبات التسجيل");
        return;
    }

    const tableBody =
        document.getElementById("pendingStudentsTable");

    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = "";

    data.forEach(function(student, index) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.first_name || ""}</td>
            <td>${student.last_name || ""}</td>
            <td>${student.school_year || ""}</td>
            <td>${student.branch || ""}</td>
            <td>${student.class_name || ""}</td>

            <td>
                <button
                    type="button"
                    onclick="acceptStudent('${student.id}')">
                    ✅ قبول
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

loadPendingStudents();
async function acceptStudent(id) {

    const confirmAccept =
        confirm("هل تريد إضافة هذا التلميذ إلى قائمة تلاميذك؟");

    if (!confirmAccept) {
        return;
    }

    const { data: { session } } =
        await supabaseClient.auth.getSession();

    if (!session) {
        alert("يجب تسجيل الدخول أولاً");
        window.location.href = "login.html";
        return;
    }

    const teacher_id = session.user.id;

    const { error } = await supabaseClient
        .from("teacher student")
        .update({
            teacher_id: teacher_id,
            status: "accepted"
        })
        .eq("id", id)
        .eq("status", "pending");

    if (error) {
        alert("❌ لم تتم إضافة التلميذ:\n" + error.message);
        console.error(error);
        return;
    }

    alert("تمت إضافة التلميذ إلى تلاميذك بنجاح ✅");

    await loadPendingStudents();
    await loadStudents();
}
// تسجيل الخروج
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async function () {

        const { error } = await supabaseClient.auth.signOut();

        if (error) {
            alert("حدث خطأ أثناء تسجيل الخروج:\n" + error.message);
            console.error(error);
            return;
        }

        window.location.replace("login.html");
    });

}


// تصدير excel
const exportExcel = document.getElementById("exportExcel");

exportExcel.addEventListener("click", function () {

    const tableBody = document.getElementById("studentsTable");

    if (!tableBody) {
        alert("❌ لم يتم العثور على جدول التلاميذ");
        return;
    }

    const rows = tableBody.querySelectorAll("tr");

    if (rows.length === 0) {
        alert("⚠️ لا يوجد تلاميذ لتصديرهم");
        return;
    }

    const excelData = [];

    // العناوين
    excelData.push([
        "الرقم",
        "الاسم",
        "اللقب",
        "تاريخ الميلاد",
        "مكان الميلاد",
        "الجنس",
        "السنة الدراسية",
        "الشعبة",
        "القسم",
        "اسم الولي",
        "هاتف ولي الأمر",
        "العنوان",
        "البريد الإلكتروني",
        "ملاحظات"
    ]);

    // بيانات التلاميذ
    rows.forEach(function(row) {

        const cells = row.querySelectorAll("td");

        excelData.push([
            cells[0]?.textContent.trim() || "",
            cells[1]?.textContent.trim() || "",
            cells[2]?.textContent.trim() || "",

            // تاريخ الميلاد كنص
            cells[3]?.textContent.trim() || "",

            cells[4]?.textContent.trim() || "",
            cells[5]?.textContent.trim() || "",
            cells[6]?.textContent.trim() || "",
            cells[7]?.textContent.trim() || "",
            cells[8]?.textContent.trim() || "",
            cells[9]?.textContent.trim() || "",
            cells[10]?.textContent.trim() || "",
            cells[11]?.textContent.trim() || "",
            cells[12]?.textContent.trim() || "",
            cells[13]?.textContent.trim() || ""
        ]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(excelData);

    // عرض الأعمدة
    worksheet["!cols"] = [
        { wch: 7 },
        { wch: 18 },
        { wch: 18 },
        { wch: 18 },
        { wch: 20 },
        { wch: 10 },
        { wch: 28 },
        { wch: 30 },
        { wch: 12 },
        { wch: 22 },
        { wch: 20 },
        { wch: 35 },
        { wch: 40 },
        { wch: 40 }
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "التلاميذ"
    );

    XLSX.writeFile(
        workbook,
        "التلاميذ.xlsx"
    );

});


// البحث بالاسم واللقب
searchStudent.addEventListener("input", applyFilters);

// البحث بالسنة
filterYear.addEventListener("change", applyFilters);

// البحث بالشعبة
filterBranch.addEventListener("change", applyFilters);

// البحث بالقسم
filterClass.addEventListener("change", applyFilters);
    window.editStudent = editStudent;
window.deleteStudent = deleteStudent;
async function deleteStudent(id) {

    const confirmDelete = confirm("هل أنت متأكد من حذف هذا التلميذ؟");

    if (!confirmDelete) {
        return;
    }

    const { error } = await supabaseClient
        .from("teacher student")
        .delete()
        .eq("id", id);

    if (error) {
        alert("❌ لم يتم الحذف:\n" + error.message);
        console.error(error);
        return;
    }

    alert("تم حذف التلميذ بنجاح ✅");

    await loadStudents();
}
async function editStudent(id) {

    const { data, error } = await supabaseClient
        .from("teacher student")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        alert("تعذر تحميل بيانات التلميذ ❌");
        console.error(error);
        return;
    }

    document.getElementById("firstName").value = data.first_name || "";
    document.getElementById("lastName").value = data.last_name || "";
    document.getElementById("birthDate").value = data.birth_date || "";
    document.getElementById("birthPlace").value = data.birth_place || "";
    document.getElementById("gender").value = data.gender || "";

    document.getElementById("schoolYear").value = data.school_year || "";
    document.getElementById("branch").value = data.branch || "";
    document.getElementById("className").value = data.class_name || "";

    document.getElementById("parentName").value = data.parent_name || "";
  document.getElementById("parentPhone").value = data.parent_phone ?? data.parentPhone ?? "";
document.getElementById("address").value = data.address ?? "";
document.getElementById("email").value = data.email ?? "";
    document.getElementById("notes").value = data.notes || "";

    window.editingStudentId = id;

    submitButton.textContent = "✏️ حفظ التعديل";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}