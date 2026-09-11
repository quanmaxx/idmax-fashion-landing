// --- FAQ Accordion Logic ---
        document.querySelectorAll('.faq-btn').forEach(button => {
            button.addEventListener('click', () => {
                const faqContent = button.nextElementSibling;
                const icon = button.querySelector('i');
                faqContent.classList.toggle('hidden');
                icon.classList.toggle('rotate-45');
            });
        });

        // --- Rich Project Gallery Data ---
        const projectsData = window.projectsData || [];

        let currentProjectIndex = 0;
        let currentImageIndex = 0;

        function openProjectGallery(index) {
            currentProjectIndex = index;
            currentImageIndex = 0;
            updateModalContent();
            document.getElementById('project-modal').classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Stop background scroll
        }

        function closeProjectGallery() {
            document.getElementById('project-modal').classList.add('hidden');
            document.body.style.overflow = 'auto'; // Restore scroll
        }

        function setMainImage(imgUrl, imgIndex) {
            currentImageIndex = imgIndex;
            document.getElementById('gallery-main-img').src = imgUrl;
            document.getElementById('gallery-img-counter').innerText = `${imgIndex + 1} / ${projectsData[currentProjectIndex].images.length}`;
            
            // Highlight active thumbnail
            const thumbs = document.querySelectorAll('#gallery-thumbnails button');
            thumbs.forEach((thumb, idx) => {
                if (idx === imgIndex) {
                    thumb.className = "w-28 aspect-[3/2] rounded-xl overflow-hidden border-2 border-brand-gold shrink-0 opacity-100 transition-all";
                } else {
                    thumb.className = "w-28 aspect-[3/2] rounded-xl overflow-hidden border border-white/20 shrink-0 opacity-50 hover:opacity-100 transition-all";
                }
            });
        }

        function updateModalContent() {
            const project = projectsData[currentProjectIndex];
            
            document.getElementById('modal-title').innerText = project.title;
            document.getElementById('modal-category').innerText = project.category;
            document.getElementById('modal-description').innerText = project.description;

            // Highlights
            const hlContainer = document.getElementById('modal-highlights');
            hlContainer.innerHTML = project.highlights.map(hl => `
                <div class="flex items-center gap-3 text-sm text-brand-cream/90">
                    <i class="fa-solid fa-circle-check text-brand-gold text-xs"></i>
                    <span>${hl}</span>
                </div>
            `).join('');

            // Thumbnails
            const thumbContainer = document.getElementById('gallery-thumbnails');
            thumbContainer.innerHTML = project.images.map((img, idx) => `
                <button onclick="setMainImage('${img}', ${idx})" class="w-28 aspect-[3/2] rounded-xl overflow-hidden border border-white/20 shrink-0 opacity-50 hover:opacity-100 transition-all">
                    <img src="${img}" alt="Ảnh ${idx + 1} của ${project.title}" class="w-full h-full object-contain bg-black/30">
                </button>
            `).join('');

            // Set initial main image
            setMainImage(project.images[0], 0);
        }

        function prevProject() {
            currentProjectIndex = (currentProjectIndex - 1 + projectsData.length) % projectsData.length;
            openProjectGallery(currentProjectIndex);
        }

        function nextProject() {
            currentProjectIndex = (currentProjectIndex + 1) % projectsData.length;
            openProjectGallery(currentProjectIndex);
        }

        // Close Modal when clicking background overlay
        document.getElementById('project-modal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeProjectGallery();
            }
        });
