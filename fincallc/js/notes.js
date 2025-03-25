// Модуль заметок будет реализован позже 

class NotesManager {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem('notes')) || [];
        this.container = document.getElementById('notes');
        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="notes-container">
                <div class="notes-header">
                    <button class="add-note-btn" data-i18n="notes.create">
                        <i class="fas fa-plus"></i> Создать заметку
                    </button>
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" placeholder="Поиск заметок..." data-i18n="notes.search">
                    </div>
                </div>

                <div class="notes-grid">
                    ${this.renderNotes()}
                </div>

                <div class="note-form-modal" style="display: none;">
                    <div class="modal-content">
                        <form id="noteForm">
                            <div class="form-header">
                                <h3 data-i18n="notes.create">Создать заметку</h3>
                                <button type="button" class="close-modal">&times;</button>
                            </div>
                            <input type="date" name="date" required>
                            <input type="text" name="title" placeholder="Заголовок" required>
                            <div class="editor-toolbar">
                                <button type="button" class="format-btn" data-format="bold">
                                    <i class="fas fa-bold"></i>
                                </button>
                                <button type="button" class="format-btn" data-format="italic">
                                    <i class="fas fa-italic"></i>
                                </button>
                                <button type="button" class="format-btn" data-format="underline">
                                    <i class="fas fa-underline"></i>
                                </button>
                                <button type="button" class="format-btn" data-format="list">
                                    <i class="fas fa-list"></i>
                                </button>
                            </div>
                            <textarea name="content" placeholder="Содержание заметки" required></textarea>
                            <div class="form-actions">
                                <button type="submit" class="save-btn">Сохранить</button>
                                <button type="button" class="cancel-btn">Отмена</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        localization.updatePageLanguage();
    }

    renderNotes() {
        return this.notes
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(note => `
                <div class="note-card" data-id="${note.id}">
                    <div class="note-header">
                        <h3>${note.title}</h3>
                        <div class="note-actions">
                            <button class="edit-note" title="Редактировать">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="delete-note" title="Удалить">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="note-date">${new Date(note.date).toLocaleDateString()}</div>
                    <div class="note-content">${this.formatContent(note.content)}</div>
                </div>
            `)
            .join('');
    }

    formatContent(content) {
        // Простое форматирование текста
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/_(.*?)_/g, '<u>$1</u>')
            .replace(/^\s*[-*]\s+(.*)$/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    }

    setupEventListeners() {
        const addBtn = this.container.querySelector('.add-note-btn');
        const modal = this.container.querySelector('.note-form-modal');
        const form = this.container.querySelector('#noteForm');
        const closeBtn = this.container.querySelector('.close-modal');
        const cancelBtn = this.container.querySelector('.cancel-btn');
        const searchInput = this.container.querySelector('.search-box input');

        // Открытие модального окна
        addBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
            form.reset();
        });

        // Закрытие модального окна
        [closeBtn, cancelBtn].forEach(btn => {
            btn.addEventListener('click', () => {
                modal.style.display = 'none';
                form.reset();
            });
        });

        // Форматирование текста
        this.container.querySelectorAll('.format-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const format = btn.dataset.format;
                const textarea = form.querySelector('textarea');
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const text = textarea.value;
                const selectedText = text.substring(start, end);

                let newText = '';
                switch (format) {
                    case 'bold':
                        newText = text.substring(0, start) + `**${selectedText}**` + text.substring(end);
                        break;
                    case 'italic':
                        newText = text.substring(0, start) + `*${selectedText}*` + text.substring(end);
                        break;
                    case 'underline':
                        newText = text.substring(0, start) + `_${selectedText}_` + text.substring(end);
                        break;
                    case 'list':
                        newText = text.substring(0, start) + `\n- ${selectedText}` + text.substring(end);
                        break;
                }

                textarea.value = newText;
                textarea.focus();
                textarea.setSelectionRange(start + 2, end + 2);
            });
        });

        // Сохранение заметки
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNote(new FormData(form));
            modal.style.display = 'none';
            form.reset();
        });

        // Поиск заметок
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const noteCards = this.container.querySelectorAll('.note-card');
            
            noteCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const content = card.querySelector('.note-content').textContent.toLowerCase();
                const isVisible = title.includes(searchTerm) || content.includes(searchTerm);
                card.style.display = isVisible ? 'block' : 'none';
            });
        });

        // Редактирование и удаление заметок
        this.container.addEventListener('click', (e) => {
            const card = e.target.closest('.note-card');
            if (!card) return;

            const id = card.dataset.id;
            if (e.target.closest('.edit-note')) {
                this.editNote(id);
            } else if (e.target.closest('.delete-note')) {
                this.deleteNote(id);
            }
        });
    }

    addNote(formData) {
        const note = {
            id: Date.now().toString(),
            title: formData.get('title'),
            content: formData.get('content'),
            date: formData.get('date')
        };

        this.notes.push(note);
        this.saveNotes();
        this.render();
    }

    editNote(id) {
        const note = this.notes.find(n => n.id === id);
        if (!note) return;

        const modal = this.container.querySelector('.note-form-modal');
        const form = this.container.querySelector('#noteForm');
        
        form.querySelector('[name="title"]').value = note.title;
        form.querySelector('[name="content"]').value = note.content;
        form.querySelector('[name="date"]').value = note.date;
        
        modal.style.display = 'flex';
        
        // Изменяем обработчик формы для редактирования
        const submitHandler = (e) => {
            e.preventDefault();
            note.title = form.querySelector('[name="title"]').value;
            note.content = form.querySelector('[name="content"]').value;
            note.date = form.querySelector('[name="date"]').value;
            
            this.saveNotes();
            this.render();
            modal.style.display = 'none';
            form.removeEventListener('submit', submitHandler);
        };
        
        form.addEventListener('submit', submitHandler);
    }

    deleteNote(id) {
        if (confirm('Вы уверены, что хотите удалить эту заметку?')) {
            this.notes = this.notes.filter(n => n.id !== id);
            this.saveNotes();
            this.render();
        }
    }

    saveNotes() {
        localStorage.setItem('notes', JSON.stringify(this.notes));
    }
}

// Инициализация модуля заметок
document.addEventListener('DOMContentLoaded', () => {
    const notesManager = new NotesManager();
}); 