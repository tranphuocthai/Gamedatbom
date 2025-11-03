document.addEventListener('DOMContentLoaded', () => {

    // --- 1. KHAI BAO BIEN & MODULE ---
    let trangThaiGame = 'menu'; // 'menu', 'dang-choi', 'tam-dung', 'ket-thuc'
    let nguoiChoi = null;
    let map = null;
    let skinDuocChon = 'skin-1';
    
    let danhSachQuaiVat = [];
    let danhSachBom = [];
    let danhSachVatPham = [];

    let idVongLapGame = null; 
    let idBoDemSinhQuai = null; 
    let soQuaiVatBanDau = 3; // Bo dem quai "goc"

    // Khoi tao Module AmThanh (Module CaiDat se duoc khoi tao sau)
    const quanLyAmThanh = new QuanLyAmThanh();

    // DOM elements
    const elManHinhMenu = document.getElementById('man-hinh-menu');
    const elManHinhGame = document.getElementById('man-hinh-game');
    const elManHinhKetThuc = document.getElementById('man-hinh-ket-thuc');
    const elBanDoGame = document.getElementById('ban-do-game');
    const elInputTen = document.getElementById('ten-nguoi-choi');
    const elNutBatDau = document.getElementById('nut-bat-dau');
    const elDanhSachSkin = document.querySelector('.danh-sach-skin');
    const elHienThiTen = document.getElementById('ui-ten-nguoi-choi');
    const elHienThiHP = document.getElementById('so-hp');
    const elHienThiBom = document.getElementById('so-bom');
    const elThongBaoKetThuc = document.getElementById('thong-bao-ket-thuc');
    const elNutChoiLai = document.getElementById('nut-choi-lai');

    // --- 2. CAC HAM CHINH QUAN LY GAME ---

    function chuyenManHinh(tenManHinh) {
        elManHinhMenu.classList.add('hidden');
        elManHinhGame.classList.add('hidden');
        elManHinhKetThuc.classList.add('hidden');

        if (tenManHinh === 'menu') {
            elManHinhMenu.classList.remove('hidden');
            trangThaiGame = 'menu';
            donDepGame();
            quanLyAmThanh.phatNhacMenu(); 
        } else if (tenManHinh === 'game') {
            elManHinhGame.classList.remove('hidden');
            batDauGameMoi(); 
        } else if (tenManHinh === 'ket-thuc') {
            elManHinhKetThuc.classList.remove('hidden');
            trangThaiGame = 'ket-thuc';
        }
    }
    
    function donDepGame() {
        if (idVongLapGame) cancelAnimationFrame(idVongLapGame);
        if (idBoDemSinhQuai) clearInterval(idBoDemSinhQuai);
        
        if (nguoiChoi) nguoiChoi.xoa();
        danhSachQuaiVat.forEach(q => q.elQuaiVat.remove());
        danhSachBom.forEach(b => b.elBom.remove());
        danhSachVatPham.forEach(v => v.elVatPham.remove());
        
        nguoiChoi = null; map = null;
        danhSachQuaiVat = []; danhSachBom = []; danhSachVatPham = [];
        soQuaiVatBanDau = 3; idVongLapGame = null; idBoDemSinhQuai = null;
        elBanDoGame.innerHTML = '';
        
        quanLyAmThanh.dungNhacGame();
    }

    function batDauGameMoi() {
        donDepGame();
        
        map = new Map('ban-do-game', gameLogic);
        map.khoiTaoBanDo(); // Tu dong random moi truong
        map.veBanDo(); 
        
        quanLyAmThanh.phatNhacGame(map.moiTruongHienTai);

        nguoiChoi = new NguoiChoi(map, 1, 1, skinDuocChon, gameLogic);
        
        elHienThiTen.textContent = elInputTen.value || 'Player 1';
        gameLogic.capNhatHUD_HP(nguoiChoi.hp);
        gameLogic.capNhatHUD_Bom(nguoiChoi.soBomToiDa);

        soQuaiVatBanDau = 3; // Reset bo dem quai goc
        
        // Truyen 'true' de danh dau 3 quai vat goc
        danhSachQuaiVat.push(new QuaiVat(map, 13, 1, 'quai-1', gameLogic, true));
        danhSachQuaiVat.push(new QuaiVat(map, 1, 11, 'quai-2', gameLogic, true));
        danhSachQuaiVat.push(new QuaiVat(map, 13, 11, 'quai-1', gameLogic, true));
        
        trangThaiGame = 'dang-choi';
        vongLapGame(); 
        idBoDemSinhQuai = setInterval(sinhQuaiVatMoi, 30000);
    }
    
    function vongLapGame() {
        if (trangThaiGame !== 'dang-choi') return;
        
        // Kiem tra NguoiChoi va cham QuaiVat
        for (const quaiVat of danhSachQuaiVat) {
            if (nguoiChoi && nguoiChoi.cot === quaiVat.cot && nguoiChoi.hang === quaiVat.hang) {
                nguoiChoi.nhanSatThuong();
                break; 
            }
        }
        
        // Kiem tra NguoiChoi an VatPham
        for (let i = danhSachVatPham.length - 1; i >= 0; i--) {
            if (nguoiChoi && nguoiChoi.cot === danhSachVatPham[i].cot && nguoiChoi.hang === danhSachVatPham[i].hang) {
                danhSachVatPham[i].biAn();
            }
        }
        idVongLapGame = requestAnimationFrame(vongLapGame);
    }
    
    function sinhQuaiVatMoi() {
        if (trangThaiGame !== 'dang-choi') return;
        const gocSpawn = [{ cot: 13, hang: 1 }, { cot: 1, hang: 11 }, { cot: 13, hang: 11 }];
        const gocDuocChon = gocSpawn[Math.floor(Math.random() * gocSpawn.length)];
        const loaiQuai = Math.random() < 0.5 ? 'quai-1' : 'quai-2';
        // Quai vat sinh ra se mac dinh 'laQuaiGoc = false'
        danhSachQuaiVat.push(new QuaiVat(map, gocDuocChon.cot, gocDuocChon.hang, loaiQuai, gameLogic));
    }
    
    function xuLyDatBom() {
        if (!nguoiChoi) return;
        const toaDoBom = nguoiChoi.datBom();
        if (toaDoBom) {
            quanLyAmThanh.phatHieuUng('dat-bom');
            const bomMoi = new Bom(map, nguoiChoi, gameLogic, toaDoBom.cot, toaDoBom.hang);
            danhSachBom.push(bomMoi);
        }
    }

    // --- 3. CAC HAM LOGIC (DINH NGHIA TRUOC) ---
    
    function tamDungGame() {
        if (trangThaiGame !== 'dang-choi') return;
        trangThaiGame = 'tam-dung';
        danhSachQuaiVat.forEach(q => q.dungDiChuyen());
        clearInterval(idBoDemSinhQuai);
        idBoDemSinhQuai = null;
    }
    function tiepTucGame() {
        if (trangThaiGame !== 'tam-dung') return;
        trangThaiGame = 'dang-choi';
        danhSachQuaiVat.forEach(q => q.batDauDiChuyen());
        // Chi khoi dong lai bo dem neu muc tieu chua xong
        if (soQuaiVatBanDau > 0) {
            idBoDemSinhQuai = setInterval(sinhQuaiVatMoi, 30000);
        }
        vongLapGame();
    }
    function choiLai() {
        chuyenManHinh('game');
    }
    function thoatVeMenu() {
        chuyenManHinh('menu');
    }
    function capNhatHUD_HP(hp) {
        elHienThiHP.textContent = `x ${hp}`;
    }
    function capNhatHUD_Bom(soBom) {
        elHienThiBom.textContent = `x ${soBom}`;
    }
    function taoVuNo(cotTrungTam, hangTrungTam, tamNo) {
        quanLyAmThanh.phatHieuUng('no');
        const banKinh = Math.floor(tamNo / 2);
        let huongBiChan = { len: false, xuong: false, trai: false, phai: false };
        new VuNo(map, gameLogic, cotTrungTam, hangTrungTam);
        for (let i = 1; i <= banKinh; i++) {
            if (!huongBiChan.len)   { const h=hangTrungTam-i, c=cotTrungTam; if(map.kiemTraVatCan(c,h)){huongBiChan.len=true; if(map.mangBanDo[h] && map.mangBanDo[h][c]===O_DA_MEM) new VuNo(map,gameLogic,c,h);} else new VuNo(map,gameLogic,c,h); }
            if (!huongBiChan.xuong) { const h=hangTrungTam+i, c=cotTrungTam; if(map.kiemTraVatCan(c,h)){huongBiChan.xuong=true; if(map.mangBanDo[h] && map.mangBanDo[h][c]===O_DA_MEM) new VuNo(map,gameLogic,c,h);} else new VuNo(map,gameLogic,c,h); }
            if (!huongBiChan.trai)  { const h=hangTrungTam, c=cotTrungTam-i; if(map.kiemTraVatCan(c,h)){huongBiChan.trai=true; if(map.mangBanDo[h] && map.mangBanDo[h][c]===O_DA_MEM) new VuNo(map,gameLogic,c,h);} else new VuNo(map,gameLogic,c,h); }
            if (!huongBiChan.phai)  { const h=hangTrungTam, c=cotTrungTam+i; if(map.kiemTraVatCan(c,h)){huongBiChan.phai=true; if(map.mangBanDo[h] && map.mangBanDo[h][c]===O_DA_MEM) new VuNo(map,gameLogic,c,h);} else new VuNo(map,gameLogic,c,h); }
        }
    }
    
    //  Logic roi vat pham
    function roiVatPham(cot, hang) {
        if (trangThaiGame !== 'dang-choi' || !nguoiChoi) return;

        let loaiVatPham = null;
        
        // Ti le roi bom: 20% (Chi roi neu nguoi choi chua max bom)
        if (nguoiChoi.soBomToiDa < 3 && Math.random() < 0.20) { 
            loaiVatPham = 'them-bom';
        } 
        // Ti le roi HP: 10% (doc lap)
        else if (Math.random() < 0.10) { 
            loaiVatPham = 'hoi-hp';
        }

        // Neu mot vat pham duoc chon
        if (loaiVatPham) {
            // Kiem tra xem o nay da co vat pham chua
            if (!danhSachVatPham.some(v => v.cot === cot && v.hang === hang)) {
                danhSachVatPham.push(new VatPham(map, gameLogic, cot, hang, loaiVatPham));
            }
        }
    }
    
    function xuLyAnVatPham(idVatPham, loaiVatPham) {
        if (!nguoiChoi) return;
        quanLyAmThanh.phatHieuUng('an-vat-pham');
        danhSachVatPham = danhSachVatPham.filter(v => v.id !== idVatPham);
        nguoiChoi.anVatPham(loaiVatPham);
        gameLogic.capNhatHUD_HP(nguoiChoi.hp);
        gameLogic.capNhatHUD_Bom(nguoiChoi.soBomToiDa);
    }
    function xuLyBomDaNo(idBom) {
        danhSachBom = danhSachBom.filter(b => b.id !== idBom);
    }
    
    //  Logic xu ly quai vat chet
    function xuLyQuaiVatChet(idQuaiVat) {
        // Tim quai vat trong danh sach
        const index = danhSachQuaiVat.findIndex(q => q.id === idQuaiVat);
        if (index === -1) return; // Khong tim thay
        
        const quaiBiDiet = danhSachQuaiVat[index];

        // Kiem tra xem co phai quai "goc" khong
        if (quaiBiDiet.laQuaiGoc) {
            soQuaiVatBanDau--;
        }
        
        // Xoa quai vat khoi danh sach
        danhSachQuaiVat.splice(index, 1);
        
        // Kiem tra xem da hoan thanh muc tieu (diet 3 quai goc) chua
        if (soQuaiVatBanDau === 0) {
            // Da hoan thanh muc tieu -> DUNG SINH QUAI MOI
            if (idBoDemSinhQuai) {
                clearInterval(idBoDemSinhQuai);
                idBoDemSinhQuai = null;
            }
        }
        
        // Kiem tra dieu kien thang:
        // 1. Da diet het quai goc (soQuaiVatBanDau === 0)
        // 2. Da "don dep" het quai sinh sau (danhSachQuaiVat.length === 0)
        if (soQuaiVatBanDau === 0 && danhSachQuaiVat.length === 0) {
            gameLogic.ketThucGame('thang');
        }
    }
    
    function kiemTraVaChamVoiBom(cot, hang) {
        return danhSachBom.some(bom => bom.cot === cot && bom.hang === hang);
    }
    function kiemTraVaChamVuNoVoiNguoiChoi(cotNo, hangNo) {
        if (nguoiChoi && nguoiChoi.cot === cotNo && nguoiChoi.hang === hangNo) nguoiChoi.nhanSatThuong();
    }
    function kiemTraVaChamVuNoVoiQuaiVat(cotNo, hangNo) {
        for (let i = danhSachQuaiVat.length - 1; i >= 0; i--) {
            if (danhSachQuaiVat[i].cot === cotNo && danhSachQuaiVat[i].hang === hangNo) {
                danhSachQuaiVat[i].biTieuDiet(); 
            }
        }
    }
    function kiemTraVaChamVuNoVoiBom(cotNo, hangNo) {
        for (const bom of danhSachBom) {
            if (bom.cot === cotNo && bom.hang === hangNo) bom.biKichNo();
        }
    }
    function ketThucGame(ketQua) { 
        if (trangThaiGame === 'ket-thuc') return; 
        trangThaiGame = 'ket-thuc';
        
        quanLyAmThanh.dungNhacGame();
        
        if (idVongLapGame) cancelAnimationFrame(idVongLapGame);
        if (idBoDemSinhQuai) clearInterval(idBoDemSinhQuai);
        idVongLapGame = null; idBoDemSinhQuai = null;
        danhSachQuaiVat.forEach(q => q.dungDiChuyen());
        
        if (ketQua === 'thang') {
            elThongBaoKetThuc.textContent = "Bạn đã thắng!";
            elManHinhKetThuc.style.backgroundImage = "url('assets/hinhAnh/nen/nen-game-win.png')";
        } else {
            quanLyAmThanh.phatHieuUng('chet');
            elThongBaoKetThuc.textContent = "Thua rồi!";
            elManHinhKetThuc.style.backgroundImage = "url('assets/hinhAnh/nen/nen-game-over.png')";
        }
        setTimeout(() => chuyenManHinh('ket-thuc'), 1000);
    }

    // --- 4. KHOI TAO "NHAC TRUONG" GAMELOGIC ---
    const gameLogic = {
        tamDungGame,
        tiepTucGame,
        choiLai,
        thoatVeMenu,
        capNhatHUD_HP,
        capNhatHUD_Bom,
        taoVuNo,
        roiVatPham,
        xuLyBomDaNo,
        xuLyQuaiVatChet,
        xuLyAnVatPham,
        kiemTraVaChamVoiBom,
        kiemTraVaChamVuNoVoiNguoiChoi,
        kiemTraVaChamVuNoVoiQuaiVat,
        kiemTraVaChamVuNoVoiBom,
        ketThucGame
    };

    // --- 5. KHOI TAO MODULE CAIDAT (SAU KHI DA CO GAMELOGIC) ---
    const quanLyCaiDat = new QuanLyCaiDat(gameLogic);
    quanLyCaiDat.ketNoi(quanLyAmThanh);


    // --- 6. LANG NGHE SU KIEN (Event Listeners) ---

    elNutBatDau.addEventListener('click', () => {
        quanLyAmThanh.khoiDongTuongTac(); // MO KHOA AM THANH (se phat nhac menu)
        chuyenManHinh('game');
    });

    elDanhSachSkin.addEventListener('click', (e) => {
        if (e.target.classList.contains('skin-option')) {
            document.querySelectorAll('.skin-option').forEach(el => el.classList.remove('active'));
            e.target.classList.add('active');
            skinDuocChon = e.target.dataset.skin;
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (trangThaiGame !== 'dang-choi' || !nguoiChoi) return;
        if (['w', 'a', 's', 'd', 'W', 'A', 'S', 'D', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key)) {
            e.preventDefault();
        }
        switch(e.key) {
            case 'w': case 'W': case 'ArrowUp': nguoiChoi.diChuyen('len'); break;
            case 's': case 'S': case 'ArrowDown': nguoiChoi.diChuyen('xuong'); break;
            case 'a': case 'A': case 'ArrowLeft': nguoiChoi.diChuyen('trai'); break;
            case 'd': case 'D': case 'ArrowRight': nguoiChoi.diChuyen('phai'); break;
            case 'Enter': xuLyDatBom(); break;
        }
    });
    
    elBanDoGame.addEventListener('click', () => {
        if (trangThaiGame !== 'dang-choi') return;
        xuLyDatBom();
    });
    
    elNutChoiLai.addEventListener('click', () => {
        quanLyAmThanh.phatHieuUng('bam-nut');
        chuyenManHinh('menu');
    });


    // --- 7. KHOI DONG BAN DAU ---
    chuyenManHinh('menu');

});