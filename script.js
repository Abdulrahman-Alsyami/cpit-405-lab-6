// State management using JavaScript variables (simulating cookies)
let state = {
    likes: 0,
    dislikes: 0,
    userVote: null, // 'like', 'dislike', or null
    hasCommented: false,
    comments: []
};

// DOM elements
const likeBtn = document.getElementById('likeBtn');
const dislikeBtn = document.getElementById('dislikeBtn');
const likeCount = document.getElementById('likeCount');
const dislikeCount = document.getElementById('dislikeCount');
const commentInput = document.getElementById('commentInput');
const submitBtn = document.getElementById('submitBtn');
const commentsList = document.getElementById('commentsList');
const resetBtn = document.getElementById('resetBtn');
const messageArea = document.getElementById('messageArea');

// Initialize UI based on state
function updateUI() {
    // Update counters
    likeCount.textContent = state.likes;
    dislikeCount.textContent = state.dislikes;

    // Update button states based on user vote
    if (state.userVote === 'like') {
        likeBtn.classList.add('disabled');
        dislikeBtn.classList.remove('disabled');
    } else if (state.userVote === 'dislike') {
        dislikeBtn.classList.add('disabled');
        likeBtn.classList.remove('disabled');
    } else {
        likeBtn.classList.remove('disabled');
        dislikeBtn.classList.remove('disabled');
    }

    // Update comment button state
    submitBtn.disabled = state.hasCommented;

    // Render comments
    renderComments();
}

// Show temporary message to user
function showMessage(text, type = 'success') {
    messageArea.innerHTML = `<div class="message ${type}">${text}</div>`;
    setTimeout(() => {
        messageArea.innerHTML = '';
    }, 3000);
}

// Handle like button click
likeBtn.addEventListener('click', () => {
    // Prevent multiple likes
    if (state.userVote === 'like') return;

    // If user previously disliked, decrement dislike count
    if (state.userVote === 'dislike') {
        state.dislikes--;
    }

    // Increment like count and set user vote
    state.likes++;
    state.userVote = 'like';
    
    // Add animation
    likeBtn.classList.add('clicked');
    setTimeout(() => likeBtn.classList.remove('clicked'), 500);
    
    showMessage('شكراً لإعجابك! 👍');
    updateUI();
});

// Handle dislike button click
dislikeBtn.addEventListener('click', () => {
    // Prevent multiple dislikes
    if (state.userVote === 'dislike') return;

    // If user previously liked, decrement like count
    if (state.userVote === 'like') {
        state.likes--;
    }

    // Increment dislike count and set user vote
    state.dislikes++;
    state.userVote = 'dislike';
    
    // Add animation
    dislikeBtn.classList.add('clicked');
    setTimeout(() => dislikeBtn.classList.remove('clicked'), 500);
    
    showMessage('شكراً لملاحظاتك! 👎');
    updateUI();
});

// Handle comment submission
submitBtn.addEventListener('click', () => {
    const comment = commentInput.value.trim();
    
    // Validate comment
    if (!comment) {
        showMessage('الرجاء إدخال تعليق!', 'info');
        return;
    }

    // Check if user already commented
    if (state.hasCommented) {
        showMessage('لقد قمت بالتعليق بالفعل!', 'info');
        return;
    }

    // Add comment to state
    state.comments.push({
        text: comment,
        timestamp: new Date().toLocaleString('ar-SA')
    });
    
    state.hasCommented = true;
    commentInput.value = '';
    
    showMessage('تم إضافة التعليق بنجاح! 💬');
    updateUI();
});

// Handle Enter key in comment input
commentInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submitBtn.click();
    }
});

// Render comments list
function renderComments() {
    if (state.comments.length === 0) {
        commentsList.innerHTML = '<div class="no-comments">لا توجد تعليقات بعد. كن أول من يعلق!</div>';
        return;
    }

    commentsList.innerHTML = state.comments
        .map(comment => `
            <div class="comment-item">
                <div class="comment-text">${escapeHtml(comment.text)}</div>
            </div>
        `)
        .join('');
}

// Escape HTML to prevent XSS attacks
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Handle reset button
resetBtn.addEventListener('click', () => {
    if (confirm('هل أنت متأكد من إعادة تعيين كل شيء؟ سيتم مسح تصويتك وتعليقاتك.')) {
        // Reset state to initial values
        state = {
            likes: 0,
            dislikes: 0,
            userVote: null,
            hasCommented: false,
            comments: []
        };
        
        showMessage('تم إعادة تعيين كل شيء! 🔄');
        updateUI();
    }
});

// Initialize on page load
updateUI();