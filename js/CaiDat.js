// Module quan ly menu Cai Dat (Pause, Am luong, Thoat...)
class QuanLyCaiDat {
    constructor(mainGameLogic) {
        this.gameLogic = mainGameLogic; // De goi cac ham tamDung, tiepTuc...
        this.quanLyAmThanh = null; // Se duoc set tu main.js

        // Lay DOM elements
        this.elManHinh = document.getElementById('man-hinh-cai-dat');
        this.elNutIcon = document.getElementById('nut-icon-cai-dat');
        
        this.elNutTiepTuc = document.getElementById('nut-tiep-tuc');
        this.elNutChoiLai = document.getElementById('nut-choi-lai-settings');
        this.elNutThoat = document.getElementById('nut-thoat-menu');
        
        this.elSliderNhac = document.getElementById('am-luong-nhac');
        this.elSliderHieuUng = document.getElementById('am-luong-hieu-ung');
    }

    // Ham nay duoc goi tu main.js de ket noi moi thu
    ketNoi(quanLyAmThanh) {
        this.quanLyAmThanh = quanLyAmThanh;
        this.langNgheSuKien();
        
        // Thiet lap am luong ban dau cho slider
        // Doc tu 'nhacNenMenu'
        this.elSliderNhac.value = this.quanLyAmThanh.nhacNenMenu.volume * 100;
        this.elSliderHieuUng.value = this.quanLyAmThanh.hieuUng['bam-nut'].volume * 100;
    }

    langNgheSuKien() {
        // Nut mo menu
        this.elNutIcon.addEventListener('click', () => {
            this.quanLyAmThanh.phatHieuUng('bam-nut');
            this.hienThi();
        });

        // Nut dong menu
        this.elNutTiepTuc.addEventListener('click', () => {
            this.quanLyAmThanh.phatHieuUng('bam-nut');
            this.anDi();
            this.gameLogic.tiepTucGame(); // Goi ham cua main.js
        });
        
        // Nut choi lai
        this.elNutChoiLai.addEventListener('click', () => {
            this.quanLyAmThanh.phatHieuUng('bam-nut');
            this.anDi();
            this.gameLogic.choiLai(); // Goi ham cua main.js
        });
        
        // Nut thoat
        this.elNutThoat.addEventListener('click', () => {
            this.quanLyAmThanh.phatHieuUng('bam-nut');
            this.anDi();
            this.gameLogic.thoatVeMenu(); // Goi ham cua main.js
        });

        // Slider am luong
        this.elSliderNhac.addEventListener('input', (e) => {
            this.quanLyAmThanh.capNhatAmLuongNhac(e.target.value / 100);
        });
        
        this.elSliderHieuUng.addEventListener('input', (e) => {
            this.quanLyAmThanh.capNhatAmLuongHieuUng(e.target.value / 100);
        });
    }

    hienThi() {
        this.elManHinh.classList.remove('hidden');
        this.gameLogic.tamDungGame(); // Goi ham cua main.js (ham nay da co kiem tra 'dang-choi')
    }

    anDi() {
        this.elManHinh.classList.add('hidden');
    }
}