import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Modify renderBars signature and logic
old_renderBars = """function renderBars(arr, comparing = [], sorted = [], swapping = []) {
            const container = document.getElementById('arrayContainer');
            container.innerHTML = '';
            const maxVal = Math.max(...arr);

            arr.forEach((val, i) => {
                const barHeight = Math.round((val / maxVal) * 250) + 20;
                let state = 'default';
                if (swapping.includes(i)) state = 'swapping';
                else if (comparing.includes(i)) state = 'comparing';
                else if (sorted.includes(i)) state = 'sorted';

                container.innerHTML += `
                    <div class="bar ${state}">
                        <div class="bar-inner" style="height:${barHeight}px">${val}</div>
                        <div class="bar-label">[${i}]</div>
                    </div>`;
            });
        }"""

new_renderBars = """function renderBars(arr, comparing = [], sorted = [], swapping = [], extras = {}) {
            const container = document.getElementById('arrayContainer');
            container.innerHTML = '';
            const maxVal = Math.max(...arr);

            arr.forEach((val, i) => {
                const barHeight = Math.round((val / maxVal) * 250) + 20;
                let state = 'default';
                if (swapping.includes(i)) state = 'swapping';
                else if (comparing.includes(i)) state = 'comparing';
                else if (sorted.includes(i)) state = 'sorted';

                let styleStr = "";
                if (extras.gapAt === i) {
                    styleStr += "margin-right: 40px;";
                }
                if (extras.dimOutside && (i < extras.dimOutside[0] || i > extras.dimOutside[1])) {
                    styleStr += "opacity: 0.15;";
                }

                container.innerHTML += `
                    <div class="bar ${state}" style="${styleStr}">
                        <div class="bar-inner" style="height:${barHeight}px">${val}</div>
                        <div class="bar-label">[${i}]</div>
                    </div>`;
            });
        }"""

content = content.replace(old_renderBars, new_renderBars)

# Modify runMergeSort
old_mergeSortHelper = """                const mid = Math.floor((start + end) / 2);
                setInfo(`✂️ 分割陣列`, `將區間 [${start}~${end}] 分為 [${start}~${mid}] 和 [${mid+1}~${end}]`);
                await sleep(getDelay());"""

new_mergeSortHelper = """                const mid = Math.floor((start + end) / 2);
                renderBars(arr, [], sortedIdx, [], { gapAt: mid, dimOutside: [start, end] });
                setInfo(`✂️ 分割陣列`, `將區間 [${start}~${end}] 從中間切開，分為左半 [${start}~${mid}] 和右半 [${mid+1}~${end}]`);
                await sleep(getDelay() * 1.5);"""

content = content.replace(old_mergeSortHelper, new_mergeSortHelper)

# In merge(), visually show the subset being merged
old_merge_start = """                let temp = [];
                let i = start, j = mid + 1;
                highlightLine(9); await sleep(getDelay() * 0.4);
                
                while (i <= mid && j <= end) {"""

new_merge_start = """                let temp = [];
                let i = start, j = mid + 1;
                renderBars(arr, [], sortedIdx, [], { gapAt: mid, dimOutside: [start, end] });
                highlightLine(9); await sleep(getDelay() * 0.4);
                
                while (i <= mid && j <= end) {"""

content = content.replace(old_merge_start, new_merge_start)

# Replace renderBars calls inside merge loop
old_merge_render = "renderBars(arr, [i, j], sortedIdx);"
new_merge_render = "renderBars(arr, [i, j], sortedIdx, [], { gapAt: mid, dimOutside: [start, end] });"
content = content.replace(old_merge_render, new_merge_render)

# Replace renderBars call at the end of merge loop
old_merge_render2 = "renderBars(arr, [k], sortedIdx, [k]);"
new_merge_render2 = "renderBars(arr, [k], sortedIdx, [k], { gapAt: -1, dimOutside: [start, end] });"
content = content.replace(old_merge_render2, new_merge_render2)


with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Complete.")
