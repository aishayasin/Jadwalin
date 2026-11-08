
const statusDaftar = [
    "Direncanakan",
    "Berlangsung",
    "Selesai",
    "Batal"
];

let penggunaAktif = null;

let kegiatan = [
    {
        id: 1,
        nama: "Rapat Koordinasi",
        tanggal: "2026-10-14",
        waktu: "09:00",
        lokasi: "Ruang Rapat",
        pic: "Siti Nurhaliza",
        status: "Direncanakan",
        deskripsi: "Membahas rencana kegiatan organisasi."
    },
    {
        id: 2,
        nama: "Pelatihan Organisasi",
        tanggal: "2026-10-18",
        waktu: "08:00",
        lokasi: "Aula",
        pic: "Andi Pratama",
        status: "Direncanakan",
        deskripsi: "Pelatihan kepemimpinan dan organisasi."
    },
    {
        id: 3,
        nama: "Bakti Sosial",
        tanggal: "2026-10-20",
        waktu: "08:00",
        lokasi: "Kampung Melati",
        pic: "Budi Santoso",
        status: "Berlangsung",
        deskripsi: "Kegiatan pengabdian kepada masyarakat."
    },
    {
        id: 4,
        nama: "Seminar Kepemimpinan",
        tanggal: "2026-10-25",
        waktu: "09:00",
        lokasi: "Aula",
        pic: "Dewi Lestari",
        status: "Selesai",
        deskripsi: "Seminar pengembangan kepemimpinan."
    },
    {
        id: 5,
        nama: "Peringatan Hari Pahlawan",
        tanggal: "2026-11-10",
        waktu: "08:00",
        lokasi: "Lapangan",
        pic: "Rizky Maulana",
        status: "Batal",
        deskripsi: "Agenda peringatan Hari Pahlawan."
    }
];

let anggota = [
    { nama: "Andi Pratama", nim: "A123456", jabatan: "Ketua" },
    { nama: "Siti Nurhaliza", nim: "A123457", jabatan: "Sekretaris" },
    { nama: "Budi Santoso", nim: "A123458", jabatan: "Bendahara" },
    { nama: "Dewi Lestari", nim: "A123459", jabatan: "Anggota" },
    { nama: "Rizky Maulana", nim: "A123460", jabatan: "Anggota" }
];

const menuAdmin = [
    { id: "Dashboard", teks: "▦ Dashboard", halaman: "Dashboard" },
    { id: "Kegiatan", teks: "▣ Kelola Kegiatan", halaman: "Kegiatan" },
    { id: "Anggota", teks: "♟ Kelola Anggota", halaman: "Anggota" },
    { id: "Kalender", teks: "▦ Kalender", halaman: "Kalender" },
    { id: "Laporan", teks: "▤ Laporan", halaman: "Laporan" },
    { id: "Pengaturan", teks: "⚙ Pengaturan", halaman: "Pengaturan" }
];

const menuAnggota = [
    { id: "Dashboard", teks: "▦ Dashboard", halaman: "Dashboard" },
    { id: "Laporan", teks: "▤ Laporan", halaman: "Laporan" },
    { id: "Pengaturan", teks: "⚙ Pengaturan", halaman: "Pengaturan" }
];

function teksAman(teks) {
    return String(teks ?? "").replace(/[&<>"']/g, karakter => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[karakter]);
}

function formatTanggal(tanggal) {
    if (!tanggal) return "-";

    const bagian = tanggal.split("-");
    return `${bagian[2]}-${bagian[1]}-${bagian[0]}`;
}

function kelasStatus(status) {
    const kelas = {
        "Direncanakan": "status-direncanakan",
        "Berlangsung": "status-berlangsung",
        "Selesai": "status-selesai",
        "Batal": "status-batal"
    };

    return kelas[status] || "";
}

function tampilanStatus(status) {
    return `<span class="status ${kelasStatus(status)}">${teksAman(status)}</span>`;
}

/* LOGIN */

document.getElementById("formLogin").addEventListener("submit", function (event) {
    event.preventDefault();

    const nama = document.getElementById("namaPengguna").value.trim();
    const kataSandi = document.getElementById("kataSandi").value;
    const peran = document.getElementById("jenisAkun").value;
    const pesan = document.getElementById("pesanLogin");

    if (!nama || !kataSandi) {
        pesan.textContent = "Nama pengguna dan kata sandi wajib diisi.";
        return;
    }

    // Demo tampilan: login belum terhubung ke server.
    penggunaAktif = {
        nama: nama,
        peran: peran
    };

    document.getElementById("halamanLogin").classList.add("tersembunyi");
    document.getElementById("aplikasi").classList.remove("tersembunyi");

    document.getElementById("namaTampilan").textContent = nama;
    document.getElementById("namaHeader").textContent = nama;
    document.getElementById("peranTampilan").textContent =
        peran === "admin" ? "Admin" : "Anggota";
    document.getElementById("peranHeader").textContent =
        peran === "admin" ? "Administrator" : "Anggota";
    document.getElementById("inisialPengguna").textContent =
        nama.charAt(0).toUpperCase();

    document.getElementById("pengaturanNama").value = nama;
    document.getElementById("pengaturanPeran").value =
        peran === "admin" ? "Admin" : "Anggota";

    buatMenu();
    perbaruiSemuaData();
    bukaHalaman("Dashboard");
});

function keluarAplikasi() {
    penggunaAktif = null;

    document.getElementById("aplikasi").classList.add("tersembunyi");
    document.getElementById("halamanLogin").classList.remove("tersembunyi");
    document.getElementById("formLogin").reset();
    document.getElementById("pesanLogin").textContent = "";
}

/* MENU BERDASARKAN PERAN */

function buatMenu() {
    const menu = penggunaAktif.peran === "admin" ? menuAdmin : menuAnggota;
    const wadah = document.getElementById("menuNavigasi");

    wadah.innerHTML = menu.map(item => `
        <button class="menu-item"
            data-halaman="${item.id}"
            onclick="bukaHalaman('${item.halaman}')">
            ${item.teks}
        </button>
    `).join("");

    document.querySelectorAll(".khusus-admin").forEach(elemen => {
        elemen.classList.toggle("tersembunyi", penggunaAktif.peran !== "admin");
    });
}

/* PINDAH HALAMAN */

function bukaHalaman(namaHalaman) {
    if (!penggunaAktif) return;

    if (penggunaAktif.peran === "anggota" &&
        !["Dashboard", "Laporan", "Pengaturan"].includes(namaHalaman)) {
        namaHalaman = "Dashboard";
    }

    const daftarHalaman = [
        "Dashboard", "Kegiatan", "Anggota",
        "Kalender", "Laporan", "Pengaturan"
    ];

    daftarHalaman.forEach(nama => {
        document.getElementById("halaman" + nama).classList.add("tersembunyi");
    });

    document.getElementById("halaman" + namaHalaman).classList.remove("tersembunyi");

    document.getElementById("judulHalaman").textContent = {
        Dashboard: "Dashboard",
        Kegiatan: "Kelola Kegiatan",
        Anggota: "Kelola Anggota",
        Kalender: "Kalender Kegiatan",
        Laporan: "Laporan Kegiatan",
        Pengaturan: "Pengaturan"
    }[namaHalaman];

    document.getElementById("deskripsiHalaman").textContent = {
        Dashboard: "Ringkasan informasi kegiatan organisasi.",
        Kegiatan: "Tambah, ubah, dan hapus agenda kegiatan.",
        Anggota: "Kelola data anggota organisasi.",
        Kalender: "Lihat jadwal kegiatan berdasarkan tanggal.",
        Laporan: "Rekap kegiatan dan informasi organisasi.",
        Pengaturan: "Kelola informasi akun yang digunakan."
    }[namaHalaman];

    document.querySelectorAll(".menu-item").forEach(tombol => {
        tombol.classList.toggle(
            "aktif",
            tombol.dataset.halaman === namaHalaman
        );
    });

    if (namaHalaman === "Kegiatan") tampilkanKegiatan();
    if (namaHalaman === "Anggota") tampilkanAnggota();
    if (namaHalaman === "Kalender") tampilkanKalender();
    if (namaHalaman === "Laporan") tampilkanLaporan();
}

/* DASHBOARD DAN RINGKASAN */

function perbaruiSemuaData() {
    const jumlah = status => kegiatan.filter(item => item.status === status).length;

    document.getElementById("jumlahDirencanakan").textContent = jumlah("Direncanakan");
    document.getElementById("jumlahBerlangsung").textContent = jumlah("Berlangsung");
    document.getElementById("jumlahSelesai").textContent = jumlah("Selesai");
    document.getElementById("jumlahBatal").textContent = jumlah("Batal");

    document.getElementById("tabelDashboard").innerHTML = kegiatan.map(item => `
        <tr>
            <td>${teksAman(item.nama)}</td>
            <td>${formatTanggal(item.tanggal)}</td>
            <td>${teksAman(item.lokasi)}</td>
            <td>${tampilanStatus(item.status)}</td>
        </tr>
    `).join("");

    tampilkanKegiatan();
    tampilkanAnggota();
    tampilkanLaporan();
}

/* KELOLA KEGIATAN */

function tampilkanFormKegiatan(id = null) {
    if (penggunaAktif?.peran !== "admin") return;

    document.getElementById("formDataKegiatan").reset();
    document.getElementById("idKegiatan").value = "";

    if (id !== null) {
        const item = kegiatan.find(k => k.id === id);
        if (!item) return;

        document.getElementById("idKegiatan").value = item.id;
        document.getElementById("namaKegiatan").value = item.nama;
        document.getElementById("tanggalKegiatan").value = item.tanggal;
        document.getElementById("waktuKegiatan").value = item.waktu;
        document.getElementById("lokasiKegiatan").value = item.lokasi;
        document.getElementById("picKegiatan").value = item.pic;
        document.getElementById("statusKegiatan").value = item.status;
        document.getElementById("deskripsiKegiatan").value = item.deskripsi;
        document.getElementById("judulFormKegiatan").textContent = "Ubah Kegiatan";
    } else {
        document.getElementById("judulFormKegiatan").textContent = "Tambah Kegiatan";
    }

    document.getElementById("formKegiatan").classList.remove("tersembunyi");
    document.getElementById("formKegiatan").scrollIntoView({ behavior: "smooth" });
}

function tutupFormKegiatan() {
    document.getElementById("formKegiatan").classList.add("tersembunyi");
}

document.getElementById("formDataKegiatan").addEventListener("submit", function (event) {
    event.preventDefault();
    if (penggunaAktif?.peran !== "admin") return;

    const id = document.getElementById("idKegiatan").value;

    const data = {
        id: id ? Number(id) : Date.now(),
        nama: document.getElementById("namaKegiatan").value.trim(),
        tanggal: document.getElementById("tanggalKegiatan").value,
        waktu: document.getElementById("waktuKegiatan").value,
        lokasi: document.getElementById("lokasiKegiatan").value.trim(),
        pic: document.getElementById("picKegiatan").value.trim(),
        status: document.getElementById("statusKegiatan").value,
        deskripsi: document.getElementById("deskripsiKegiatan").value.trim()
    };

    if (id) {
        kegiatan = kegiatan.map(item => item.id === Number(id) ? data : item);
    } else {
        kegiatan.push(data);
    }

    tutupFormKegiatan();
    perbaruiSemuaData();
    bukaHalaman("Kegiatan");
});

function tampilkanKegiatan() {
    const wadah = document.getElementById("tabelKegiatan");
    if (!wadah) return;

    const kataKunci = (
        document.getElementById("cariKegiatan")?.value || ""
    ).toLowerCase();

    const hasil = kegiatan.filter(item =>
        item.nama.toLowerCase().includes(kataKunci)
    );

    if (hasil.length === 0) {
        wadah.innerHTML = `<tr><td colspan="5">Data kegiatan tidak ditemukan.</td></tr>`;
        return;
    }

    wadah.innerHTML = hasil.map(item => `
        <tr>
            <td>${teksAman(item.nama)}</td>
            <td>${formatTanggal(item.tanggal)}</td>
            <td>${teksAman(item.lokasi)}</td>
            <td>${tampilanStatus(item.status)}</td>
            <td>
                <div class="aksi-tabel">
                    <button class="tombol-kecil"
                        onclick="tampilkanFormKegiatan(${item.id})">Ubah</button>
                    <button class="tombol-kecil tombol-hapus"
                        onclick="hapusKegiatan(${item.id})">Hapus</button>
                </div>
            </td>
        </tr>
    `).join("");
}

function hapusKegiatan(id) {
    if (penggunaAktif?.peran !== "admin") return;

    const item = kegiatan.find(k => k.id === id);
    if (!item) return;

    if (confirm(`Yakin ingin menghapus kegiatan "${item.nama}"?`)) {
        kegiatan = kegiatan.filter(k => k.id !== id);
        perbaruiSemuaData();
    }
}

/* KELOLA ANGGOTA */

function tampilkanFormAnggota() {
    if (penggunaAktif?.peran !== "admin") return;
    document.getElementById("formDataAnggota").reset();
    document.getElementById("formAnggota").classList.remove("tersembunyi");
}

document.getElementById("formDataAnggota").addEventListener("submit", function (event) {
    event.preventDefault();
    if (penggunaAktif?.peran !== "admin") return;

    anggota.push({
        nama: document.getElementById("namaAnggota").value.trim(),
        nim: document.getElementById("nimAnggota").value.trim(),
        jabatan: document.getElementById("jabatanAnggota").value.trim()
    });

    document.getElementById("formAnggota").classList.add("tersembunyi");
    perbaruiSemuaData();
});

function tampilkanAnggota() {
    const wadah = document.getElementById("tabelAnggota");
    if (!wadah) return;

    wadah.innerHTML = anggota.map((item, index) => `
        <tr>
            <td>${teksAman(item.nama)}</td>
            <td>${teksAman(item.nim)}</td>
            <td>${teksAman(item.jabatan)}</td>
            <td>
                <button class="tombol-kecil tombol-hapus"
                    onclick="hapusAnggota(${index})">Hapus</button>
            </td>
        </tr>
    `).join("");
}

function hapusAnggota(index) {
    if (penggunaAktif?.peran !== "admin") return;

    if (confirm("Yakin ingin menghapus anggota ini?")) {
        anggota.splice(index, 1);
        perbaruiSemuaData();
    }
}

/* KALENDER */

function tampilkanKalender() {
    const wadah = document.getElementById("daftarKalender");
    if (!wadah) return;

    const tanggal = document.getElementById("filterTanggal").value;

    const hasil = kegiatan
        .filter(item => !tanggal || item.tanggal === tanggal)
        .sort((a, b) => a.tanggal.localeCompare(b.tanggal));

    if (hasil.length === 0) {
        wadah.innerHTML = "<p>Tidak ada kegiatan pada tanggal tersebut.</p>";
        return;
    }

    wadah.innerHTML = hasil.map(item => `
        <div class="item-kalender">
            <strong>${teksAman(item.nama)}</strong>
            <p>${formatTanggal(item.tanggal)} · ${teksAman(item.waktu)} · ${teksAman(item.lokasi)}</p>
            <p>Status: ${tampilanStatus(item.status)}</p>
        </div>
    `).join("");
}

/* LAPORAN */

function tampilkanLaporan() {
    const jumlahPeserta = anggota.length;

    document.getElementById("totalLaporan").textContent = kegiatan.length;
    document.getElementById("totalAnggotaLaporan").textContent = anggota.length;
    document.getElementById("totalPeserta").textContent = jumlahPeserta;
    document.getElementById("totalBatalLaporan").textContent =
        kegiatan.filter(item => item.status === "Batal").length;

    document.getElementById("tabelLaporan").innerHTML = kegiatan.map(item => `
        <tr>
            <td>${teksAman(item.nama)}</td>
            <td>${formatTanggal(item.tanggal)}</td>
            <td>${teksAman(item.pic)}</td>
            <td>${tampilanStatus(item.status)}</td>
        </tr>
    `).join("");
}

/* PENGATURAN */

document.getElementById("formPengaturan").addEventListener("submit", function (event) {
    event.preventDefault();
    if (!penggunaAktif) return;

    const namaBaru = document.getElementById("pengaturanNama").value.trim();

    if (!namaBaru) {
        alert("Nama pengguna tidak boleh kosong.");
        return;
    }

    penggunaAktif.nama = namaBaru;

    document.getElementById("namaTampilan").textContent = namaBaru;
    document.getElementById("namaHeader").textContent = namaBaru;
    document.getElementById("inisialPengguna").textContent =
        namaBaru.charAt(0).toUpperCase();

    alert("Pengaturan profil berhasil diperbarui.");
});
