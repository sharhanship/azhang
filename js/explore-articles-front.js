      // اسکریپت فیلتر کردن مقالات
      document.addEventListener("DOMContentLoaded", function () {
        const filterBtns = document.querySelectorAll(".filter-btn");
        const articleCards = document.querySelectorAll(".article-card");

        filterBtns.forEach((btn) => {
          btn.addEventListener("click", function () {
            // حذف کلاس active از همه دکمه‌ها
            filterBtns.forEach((b) => b.classList.remove("active"));
            // اضافه کردن کلاس active به دکمه کلیک شده
            this.classList.add("active");

            const filterValue = this.textContent.trim();

            // فیلتر کردن مقالات
            articleCards.forEach((card) => {
              if (filterValue === "همه مقالات") {
                card.style.display = "flex";
              } else {
                const badgeText = card
                  .querySelector(".article-badge")
                  .textContent.trim();
                if (badgeText === filterValue) {
                  card.style.display = "flex";
                } else {
                  card.style.display = "none";
                }
              }
            });
          });
        });

        // اسکریپت جستجو
        const searchInput = document.querySelector(".search-box input");
        searchInput.addEventListener("input", function () {
          const searchTerm = this.value.trim().toLowerCase();

          articleCards.forEach((card) => {
            const title = card
              .querySelector(".article-title")
              .textContent.toLowerCase();
            const excerpt = card
              .querySelector(".article-excerpt")
              .textContent.toLowerCase();

            if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
              card.style.display = "flex";
            } else {
              card.style.display = "none";
            }
          });
        });

        // اسکریپت بازگشت به بالا
        const backToTopBtn = document.querySelector(".back-to-top");

        window.addEventListener("scroll", function () {
          if (window.pageYOffset > 300) {
            backToTopBtn.classList.add("active");
          } else {
            backToTopBtn.classList.remove("active");
          }
        });

        backToTopBtn.addEventListener("click", function () {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        });
      });