
/**
 * Admin SPA Logic
 * Handles navigation, modal loading, and form submission via AJAX.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Navigate to default page or hash if present
    const hash = window.location.hash.substring(1);
    if (hash) {
        loadContent(hash);
    } else {
        // Default to loading users for now, or just leave blank/dashboard stats
        // loadContent('/admin/users'); 
    }

    // Attach click listeners to sidebar navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const url = link.getAttribute('href');

            // Update URL hash for history
            window.location.hash = url;

            loadContent(url);

            // Update active state
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('bg-gray-900', 'text-white'));
            link.classList.add('bg-gray-900', 'text-white');
        });
    });

    // Delegated event listener for dynamic content (Modals, Edit buttons, Delete buttons)
    document.addEventListener('click', (e) => {
        const target = e.target.closest('a, button');

        if (!target) return;

        // Open Modal Trigger
        if (target.classList.contains('open-modal')) {
            e.preventDefault();
            const url = target.getAttribute('href') || target.dataset.url;
            openModal(url);
        }

        // Close Modal Trigger
        if (target.classList.contains('close-modal')) {
            closeModal();
        }

        // Delete Trigger
        if (target.classList.contains('delete-item')) {
            e.preventDefault();
            const url = target.getAttribute('href') || target.dataset.url;
            if (confirm('Are you sure you want to delete this item?')) {
                deleteItem(url);
            }
        }
    });

    // Delegated event listener for Forms
    document.addEventListener('submit', (e) => {
        if (e.target.classList.contains('ajax-form')) {
            e.preventDefault();
            submitForm(e.target);
        }
    });
});

async function loadContent(url) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '<div class="flex justify-center p-10"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>';

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const html = await response.text();
        mainContent.innerHTML = html;
    } catch (error) {
        mainContent.innerHTML = `<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">Error loading content: ${error.message}</div>`;
    }
}

async function openModal(url) {
    const modalContainer = document.getElementById('modal-container');
    const modalContent = document.getElementById('modal-content');

    // Show loading state in modal
    modalContainer.classList.remove('hidden');
    modalContent.innerHTML = '<div class="flex justify-center p-10"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>';

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const html = await response.text();
        modalContent.innerHTML = html;
    } catch (error) {
        modalContent.innerHTML = `<div class="text-red-500 p-4">Error loading form: ${error.message}</div>`;
    }
}

function closeModal() {
    const modalContainer = document.getElementById('modal-container');
    modalContainer.classList.add('hidden');
}

async function submitForm(form) {
    const formData = new FormData(form);
    const url = form.action;
    const method = form.method;
    const submitBtn = form.querySelector('button[type="submit"]');

    // Disable button
    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'Saving...';
    submitBtn.disabled = true;

    try {
        const response = await fetch(url, {
            method: method,
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        const data = await response.json();

        if (data.status === 'success') {
            closeModal();
            // Refresh current content
            const hash = window.location.hash.substring(1);
            if (hash) loadContent(hash);

            // Optional: Show success toast
            alert('Data saved successfully!');
        } else {
            // Show validation errors
            alert('Error: ' + JSON.stringify(data.messages));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An unexpected error occurred.');
    } finally {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
}

async function deleteItem(url) {
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (data.status === 'success') {
            const hash = window.location.hash.substring(1);
            if (hash) loadContent(hash);
        } else {
            alert('Failed to delete: ' + data.message);
        }
    } catch (error) {
        alert('Error deleting item');
    }
}
