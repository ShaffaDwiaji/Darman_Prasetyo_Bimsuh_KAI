const masterURL = "https://script.google.com/macros/s/AKfycbz5D9VRrzxrF3S9W07vZQ01ETxK0Ha_nGMJfZ_8oL0Qb_zMlot-8BGJ8wlg2ubKpLrs/exec";

document.addEventListener("DOMContentLoaded", function () {
    // Tanggal Otomatis
    const today = new Date();
    const formattedDate = today.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const tanggalLogin = document.getElementById("tanggalLogin");
    if (tanggalLogin) {
        tanggalLogin.value = formattedDate;
        document.getElementById("tanggalHidden").value = formattedDate;
    }

    // Load Data Master
    fetch(masterURL + "?action=master")
        .then(res => res.json())
        .then(data => {
        const diklatSelect = document.getElementById("diklatSelect");
        const kedudukanSelect = document.getElementById("kedudukanSelect");
        if (!diklatSelect || !kedudukanSelect) return;

        diklatSelect.innerHTML = '<option value="">-- Pilih Diklat --</option>';
        kedudukanSelect.innerHTML = '<option value="">-- Pilih Kedudukan --</option>';

        data.diklat.forEach(item => {
            let opt = document.createElement("option");
            opt.value = opt.textContent = item;
            diklatSelect.appendChild(opt);
        });

        data.kedudukan.forEach(item => {
            let opt = document.createElement("option");
            opt.value = opt.textContent = item;
            kedudukanSelect.appendChild(opt);
        });
        });

    // Submit Form
    const evalForm = document.getElementById("evaluasiForm");
    if (evalForm) {
        evalForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerText = "Mengirim...";

            const formData = new FormData(this);
            fetch(masterURL, { method: "POST", body: formData })
                .then(res => res.json())
                .then(data => {
                submitBtn.disabled = false;
                submitBtn.innerText = "Kirim Evaluasi";
                if (data.status === "success") {
                    document.getElementById("successOverlay").style.display = "flex";
                } else {
                    alert("Error: " + data.message);
                }
                })
                .catch(() => {
                submitBtn.disabled = false;
                submitBtn.innerText = "Kirim Evaluasi";
                alert("Gagal mengirim data.");
                });
        });
    }
});

// Fungsi Login (Global)
window.login = function () {
    const nama = document.getElementById("namaPeserta").value.trim();
    const nipp = document.getElementById("NIPPPeserta").value.trim();
    const diklat = document.getElementById("diklatSelect").value;
    const kedudukan = document.getElementById("kedudukanSelect").value;

    if (!nama || !nipp || !diklat || !kedudukan) return alert("Semua kolom wajib diisi!");
    if (!/^[0-9]+$/.test(nipp)) return alert("NIPP harus angka!");

    document.getElementById("namaHidden").value = nama;
    document.getElementById("nippHidden").value = nipp;
    document.getElementById("diklatHidden").value = diklat;
    document.getElementById("kedudukanHidden").value = kedudukan;

    document.getElementById("pesertaNama").innerText = nama;
    document.getElementById("pesertaNIPP").innerText = nipp;

    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("formPage").classList.remove("hidden");
};

window.kembaliKeAwal = function () {
    location.reload(); // Cara termudah untuk reset semua state
};