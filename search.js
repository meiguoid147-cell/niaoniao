// ===== 全站搜索功能 =====
// 搜索索引在页面加载时异步获取 search-index.json

let searchData = null;
let searchDebounceTimer = null;

// 获取搜索相关DOM元素
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const searchClear = document.getElementById('searchClear');

// 加载搜索索引
function loadSearchIndex() {
    fetch('search-index.json')
        .then(response => response.json())
        .then(data => {
            searchData = data;
        })
        .catch(err => {
            console.warn('搜索索引加载失败:', err);
        });
}

// 执行搜索
function performSearch(query) {
    if (!searchData || !query || query.trim().length < 1) {
        searchResults.classList.remove('visible');
        searchResults.innerHTML = '';
        searchClear.classList.remove('visible');
        return;
    }

    searchClear.classList.add('visible');
    query = query.trim().toLowerCase();

    // 搜索匹配
    var results = [];
    for (var i = 0; i < searchData.length; i++) {
        var item = searchData[i];
        var titleMatch = item.title.toLowerCase().indexOf(query) !== -1;
        var contentMatch = item.content.toLowerCase().indexOf(query) !== -1;
        var tagMatch = item.tag && item.tag.toLowerCase().indexOf(query) !== -1;

        if (titleMatch || contentMatch || tagMatch) {
            // 生成摘要（截取匹配位置附近的文字）
            var snippet = '';
            var content = item.content;
            var lowerContent = content.toLowerCase();
            var matchIndex = lowerContent.indexOf(query);

            if (matchIndex === -1) {
                matchIndex = item.title.toLowerCase().indexOf(query);
                snippet = content.substring(0, 80) + (content.length > 80 ? '…' : '');
            } else {
                var start = Math.max(0, matchIndex - 30);
                var end = Math.min(content.length, matchIndex + query.length + 50);
                snippet = (start > 0 ? '…' : '') + content.substring(start, end) + (end < content.length ? '…' : '');
            }

            // 高亮关键词
            var highlightRegex = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
            snippet = snippet.replace(highlightRegex, '<mark>$1</mark>');
            var highlightedTitle = item.title.replace(highlightRegex, '<mark>$1</mark>');

            results.push({
                title: highlightedTitle,
                snippet: snippet,
                url: item.url,
                tag: item.tag || ''
            });
        }
    }

    // 渲染结果
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-no-result">未找到「' + query + '」相关内容</div>';
    } else {
        var html = '';
        for (var j = 0; j < results.length; j++) {
            var r = results[j];
            html += '<div class="search-result-item" onclick="window.location.href=\'' + r.url + '\'">';
            html += '<div class="search-result-title">';
            html += r.title;
            if (r.tag) {
                html += ' <span class="search-result-tag">' + r.tag + '</span>';
            }
            html += '</div>';
            html += '<div class="search-result-snippet">' + r.snippet + '</div>';
            html += '</div>';
        }
        searchResults.innerHTML = html;
    }
    searchResults.classList.add('visible');
}

// 清除搜索
function clearSearch() {
    if (searchInput) {
        searchInput.value = '';
    }
    if (searchResults) {
        searchResults.classList.remove('visible');
        searchResults.innerHTML = '';
    }
    if (searchClear) {
        searchClear.classList.remove('visible');
    }
}

// 绑定搜索输入事件（带防抖）
if (searchInput) {
    searchInput.addEventListener('input', function() {
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(function() {
            performSearch(searchInput.value);
        }, 200);
    });

    // 点击搜索框外关闭结果
    document.addEventListener('click', function(e) {
        if (searchResults && !e.target.closest('.search-bar')) {
            searchResults.classList.remove('visible');
        }
    });

    // 点击搜索框时，如果有内容则重新显示结果
    searchInput.addEventListener('focus', function() {
        if (searchInput.value.trim().length > 0) {
            performSearch(searchInput.value);
        }
    });

    // 回车键跳转第一个结果
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            var firstResult = searchResults.querySelector('.search-result-item');
            if (firstResult) {
                firstResult.click();
            }
        }
    });
}

// 页面加载完成后获取搜索索引
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSearchIndex);
} else {
    loadSearchIndex();
}
