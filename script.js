gsap.registerPlugin(TextPlugin);

document.addEventListener("DOMContentLoaded", () => {
    
    // TẠO ĐÚNG 1407 SAO LI TI CHO BACKGROUND
    const bgStarsContainer = document.getElementById("bg-stars-container");
    const starFragment = document.createDocumentFragment();
    
    for (let i = 0; i < 1407; i++) { 
        let star = document.createElement("div");
        star.className = "tiny-star-bg";
        let size = Math.random() * 2 + 0.5; // Kích thước tối ưu không gây nhiễu
        star.style.width = size + "px";
        star.style.height = size + "px";
        star.style.top = Math.random() * 100 + "%";
        star.style.left = Math.random() * 100 + "%";
        
        if (Math.random() < 0.25) { // 25% nhấp nháy để mượt mắt
            star.classList.add("blink-effect");
            star.style.animationDelay = (Math.random() * 4) + "s";
        } else {
            star.style.opacity = Math.random() * 0.6 + 0.1;
        }
        
        starFragment.appendChild(star);
    }
    bgStarsContainer.appendChild(starFragment);

    const svg = document.getElementById("constellation-svg");
    const starMap = document.querySelector(".star-map");
    const wishes = ["Bình an", "May mắn", "Sức khỏe", "Hạnh phúc", "Thành công", "Những điều như ý"];
    
    // TỌA ĐỘ CHÒM SAO CỰ GIẢI
    const positions = [
        { x: 70, y: 70 }, 
        { x: 52, y: 55 }, 
        { x: 35, y: 80 }, 
        { x: 48, y: 40 }, 
        { x: 25, y: 45 }, 
        { x: 50, y: 20 }  
    ];
    let starsClicked = 0;
    let starElements = [];

    // --- HÀM CHUYỂN CẢNH MƯỢT MÀ ---
    function fadeToScene(fromId, toId, delay = 0) {
        setTimeout(() => {
            const fromScene = document.getElementById(fromId);
            const toScene = document.getElementById(toId);
            
            fromScene.style.opacity = 0;
            
            setTimeout(() => {
                fromScene.classList.remove("active");
                toScene.classList.add("active");
                
                // Kích hoạt render lại trên trình duyệt
                void toScene.offsetWidth; 
                toScene.style.opacity = 1;
            }, 1000); // 1s khớp với CSS transition
        }, delay);
    }

    // --- MÀN 1: MỞ ĐẦU ---
    const tl1 = gsap.timeline();
    tl1.to("#text-1-1", { duration: 1.5, text: "Chào em.", ease: "none" })
       .to("#text-1-2", { duration: 2.5, text: "Anh có chuẩn bị một điều nho nhỏ.", ease: "none" })
       .to("#text-1-3", { duration: 3.5, text: "Dành cho cô gái xinh đẹp của tháng 7", ease: "none" })
       .to("#btn-start", { opacity: 1, pointerEvents: "auto", duration: 1 });

    document.getElementById("btn-start").addEventListener("click", () => {
        fadeToScene("scene-1", "scene-2");
        setTimeout(initConstellation, 1000);
    });

    // --- MÀN 2: BẢN ĐỒ SAO CỰ GIẢI ---
    function initConstellation() {
        positions.forEach((pos, index) => {
            let star = document.createElement("div");
            star.className = "star-point";
            star.style.left = pos.x + "%";
            star.style.top = pos.y + "%";

            let tooltip = document.createElement("div");
            tooltip.className = "star-tooltip";
            tooltip.innerText = wishes[index];
            star.appendChild(tooltip);
            
            starElements.push(star);
            starMap.appendChild(star);

            star.addEventListener("click", function() {
                if (this.classList.contains("clicked") || index !== starsClicked) return;
                
                if (starsClicked === 0) {
                    gsap.to("#guide-text", { opacity: 0, duration: 0.5 });
                }

                this.classList.remove("blink");
                this.classList.add("clicked");

                gsap.fromTo(this, { scale: 0.5 }, { scale: 1, duration: 0.5, ease: "back.out(2)" });

                if (starsClicked > 0) {
                    drawLine(positions[starsClicked - 1], positions[starsClicked]);
                }

                starsClicked++;

                if (starsClicked < 6) {
                    gsap.to(starElements[starsClicked], { opacity: 1, duration: 0.5 });
                    starElements[starsClicked].classList.add("blink");
                } else {
                    setTimeout(mergeStarsToSeven, 2500);
                }
            });
        });

        gsap.to(starElements[0], { opacity: 1, duration: 0.5 });
        starElements[0].classList.add("blink");

        gsap.to("#guide-text", { opacity: 1, duration: 1, delay: 1 });
    }

    function drawLine(p1, p2) {
        let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", p1.x + "%");
        line.setAttribute("y1", p1.y + "%");
        line.setAttribute("x2", p2.x + "%");
        line.setAttribute("y2", p2.y + "%");
        line.setAttribute("class", "constellation-line");
        svg.appendChild(line);

        let length = line.getTotalLength();
        line.style.strokeDasharray = length;
        line.style.strokeDashoffset = length;
        gsap.to(line, { strokeDashoffset: 0, duration: 0.5, ease: "power1.inOut" });
    }

    function mergeStarsToSeven() {
        gsap.to("#constellation-svg", { opacity: 0, duration: 1 });
        document.querySelectorAll(".star-tooltip").forEach(t => t.style.opacity = 0);

        gsap.to(".star-point", {
            left: "50%", top: "50%", 
            duration: 2, 
            ease: "power2.inOut",
            onComplete: () => {
                gsap.to(".star-point", { scale: 3, opacity: 0, duration: 0.5 });
                fadeToScene("scene-2", "scene-3");
                setTimeout(playScene3, 1000);
            }
        });
    }

    // --- MÀN 3: NGÔI SAO THỨ 7 BAY LÊN ---
    function playScene3() {
        gsap.set("#star-7", { top: "50%", opacity: 1 });
        
        gsap.to("#star-7", { top: "25%", duration: 1.5, ease: "power2.inOut" });

        const tl3 = gsap.timeline({ delay: 1.5 });
        tl3.to("#text-3-1", { duration: 1, text: "Sáu ngôi sao. Sáu lời chúc.", ease: "none" })
           .to("#text-3-2", { duration: 1, text: "Nhưng bầu trời đêm, hình như vẫn còn thiếu một ngôi sao.", ease: "none", delay: 0.5 })
           .to("#text-3-3", { duration: 1, text: "Ngôi sao thứ 7.", ease: "none", delay: 0.5 })
           .to("#text-3-4", { duration: 1, text: "Chính là em.", ease: "none", delay: 0.5 });

        fadeToScene("scene-3", "scene-4", 7500); 
        setTimeout(playScene4Card, 8500);
    }

    // --- MÀN 4: THIỆP & LƯỚI ẢNH ---
    function playScene4Card() {
        const photos = document.querySelectorAll(".polaroid.grid-item");
        
        gsap.to(photos, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out"
        });

        gsap.to("#card-text", { opacity: 1, duration: 2, delay: 1.5 });
    }

    // --- CHUYỂN TỪ THIỆP SANG BÁNH KEM (MÀN 6) ---
    document.getElementById("btn-next-cake").addEventListener("click", () => {
        fadeToScene("scene-4", "scene-6");
        
        const audioCake = document.getElementById("audio-cake");
        audioCake.volume = 1;
        audioCake.play().catch(e => console.log("Audio play prevented by browser interaction policy"));
        
        const age = document.getElementById("age-img");
        const msg = document.getElementById("cake-message");
        const btnBlow = document.getElementById("btn-blow");
        const candleText = document.getElementById("candle-text");

        setTimeout(() => { msg.classList.add("show"); }, 1000);

        function createStars() {
            const container = document.querySelector(".cake-wrapper");
            const fxFragment = document.createDocumentFragment();

            for(let i=0; i<100; i++) { // Giảm số lượng xuống 100 để mượt hơn trên điện thoại
                const star = document.createElement("div");
                star.className = "star-fx";
                star.innerHTML = "⭐";
                star.style.left = "50%";
                star.style.top = "35%"; 
                
                let range = window.innerWidth < 768 ? 250 : 400;
                star.style.setProperty("--x", (Math.random() * range - range/2) + "px");
                star.style.setProperty("--y", (Math.random() * range - range/2) + "px");
                
                fxFragment.appendChild(star);
                setTimeout(() => star.remove(), 2000); 
            }
            container.appendChild(fxFragment);
        }

        setTimeout(() => { age.classList.add("zoom"); }, 2000);

        setTimeout(() => { 
            createStars(); 
            age.style.opacity = "0"; 
        }, 3500);

        setTimeout(() => { 
            age.src = "assets/images/age19.png"; 
            age.style.opacity = "1"; 
            age.classList.remove("zoom"); 
        }, 5500);

        setTimeout(() => { 
            msg.innerHTML = "Chào tuổi 19"; 
            gsap.to(candleText, { opacity: 1, duration: 1 });
            btnBlow.style.display = "inline-block";
            gsap.fromTo(btnBlow, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: "back.out(1.5)" });
        }, 7000);
    });

 // --- MÀN 6 -> MÀN TRANSITION: SỰ KIỆN THỔI NẾN ---
    document.getElementById("btn-blow").addEventListener("click", () => {
        const candleText = document.getElementById("candle-text");
        const btnBlow = document.getElementById("btn-blow");

        // 1. Ẩn nút và làm mờ chữ cũ ngay lập tức
        btnBlow.style.display = "none";
        gsap.to(candleText, { opacity: 0, duration: 0.5 });
        
        // 2. TRỄ 1.5s (1500ms): Hiện dòng chữ điều ước mới
        setTimeout(() => {
            candleText.innerHTML = "Điều ước của em đã được gửi đến những vì sao.<br>Mong một ngày gần nhất, điều ước ấy sẽ thành hiện thực.";
            gsap.to(candleText, { opacity: 1, duration: 1 });
        }, 2500);

        // 3. TRỄ 3.5s (Chờ dòng chữ kia đọc xong): Bắt đầu làm mờ bánh kem và bay sao băng
        setTimeout(() => {
            gsap.to(".cake-wrapper", { opacity: 0, scale: 0.5, duration: 1.5 });
            
            const shootingStarContainer = document.getElementById("shooting-star-container");
            shootingStarContainer.style.display = "block";
            gsap.set(shootingStarContainer, { rotation: -30 });

            gsap.fromTo(shootingStarContainer, 
                { x: 0, y: 0, scale: 4, opacity: 1 }, 
                { 
                    x: window.innerWidth * 0.8, 
                    y: -window.innerHeight * 0.6, 
                    scale: 0, 
                    opacity: 0, 
                    duration: 4,       
                    ease: "power2.in", 
                    delay: 0.5         
                }
            );

            // Tắt chữ điều ước
            setTimeout(() => {
                gsap.to(candleText, { opacity: 0, duration: 1 });
            }, 4500);

            // Chuyển sang màn Transition
            fadeToScene("scene-6", "scene-transition", 5000);

            // Tắt nhạc bánh kem
            setTimeout(() => {
                const audioCake = document.getElementById("audio-cake");
                gsap.to(audioCake, { volume: 0, duration: 1.5, onComplete: () => audioCake.pause() });
            }, 5000); 
            
            // Gõ các dòng chữ 1407 ngôi sao
            setTimeout(() => {
                const tlTrans = gsap.timeline();
                tlTrans.fromTo("#trans-text-1", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 2 })
                       .fromTo("#trans-text-2", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 2 }, "+=1.5")
                       .fromTo("#trans-text-3", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 2.5 }, "+=1.5")
                       .to("#btn-stop", { opacity: 1, duration: 1, onStart: () => document.getElementById("btn-stop").style.display = "inline-block" }, "+=2.5");
            }, 6000);

        }, 4000); // <--- Chìa khóa giãn thời gian nằm ở con số 3500ms này
    });

    // --- MÀN TRANSITION -> MÀN 7: ENDING ---
    document.getElementById("btn-stop").addEventListener("click", () => {
        fadeToScene("scene-transition", "scene-7", 0);

        const audioEnding = document.getElementById("audio-ending");
        audioEnding.volume = 0; 
        audioEnding.play().catch(e => console.log("Audio play error"));
        gsap.to(audioEnding, { volume: 1, duration: 2.5 }); 

        setTimeout(() => {
            gsap.fromTo(".final-text", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 2 });
            gsap.fromTo(".date", { opacity: 0 }, { opacity: 1, duration: 2, delay: 1.5 });
        }, 1000);
    });
});