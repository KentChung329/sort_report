
        let arr = [];
        let sorting = false;
        let isPaused = false;
        let comparisons = 0;
        let swaps = 0;
        let currentAlgo = 'bubble';

        const algoData = {
            bubble: {
                title: '🫧 氣泡排序法',
                subtitle: 'Bubble Sort — 視覺化動畫解說',
                readyDesc: '按「開始排序」來觀看氣泡排序動畫',
                explain: `<h3>📖 氣泡排序原理</h3>
        每輪從頭開始，兩兩比較相鄰元素<br>
        若 <b>左 &gt; 右</b>，則交換位置<br>
        每輪結束後，<b>最大值會「浮」到最右邊</b><br>
        重複 n-1 輪，直到全部排序完成<br>
        <br>
        ⏱ 時間複雜度：最差 O(n²)，最好 O(n)`
            },
            selection: {
                title: '🔀 選擇排序法',
                subtitle: 'Selection Sort — 視覺化動畫解說',
                readyDesc: '按「開始排序」來觀看選擇排序動畫',
                explain: `<h3>📖 選擇排序原理</h3>
        從未排序區間中尋找<b>最小值</b><br>
        將該最小值與未排序區間的<b>第一個元素交換</b><br>
        每輪結束後，<b>最小值會被放置到已排序區間的最尾端</b><br>
        重複 n-1 輪，直到全部排序完成<br>
        <br>
        ⏱ 時間複雜度：O(n²)`
            },
            insertion: {
                title: '🃏 插入排序法',
                subtitle: 'Insertion Sort — 視覺化動畫解說',
                readyDesc: '按「開始排序」來觀看插入排序動畫',
                explain: `<h3>📖 插入排序原理</h3>
        將陣列分為「已排序」和「未排序」區間<br>
        每次把未排序區間的第一個元素，<b>插入到已排序區間的正確位置</b><br>
        重複 n-1 輪，直到全部排序完成<br>
        <br>
        ⏱ 時間複雜度：最差 O(n²)，最好 O(n)`
            },
            merge: {
                title: '🧬 合併排序法',
                subtitle: 'Merge Sort — 視覺化動畫解說',
                readyDesc: '按「開始排序」來觀看合併排序動畫',
                explain: `<h3>📖 合併排序原理</h3>
        採用<b>分而治之 (Divide and Conquer)</b> 策略<br>
        將陣列不斷對半分割，直到每個子陣列只剩一個元素<br>
        然後將相鄰的子陣列<b>兩兩合併</b>，合併時依大小排序<br>
        最終合併成完整有序的陣列<br>
        <br>
        ⏱ 時間複雜度：O(n log n)`
            },
            quick: {
                title: '⚡ 快速排序法',
                subtitle: 'Quick Sort — 視覺化動畫解說',
                readyDesc: '按「開始排序」來觀看快速排序動畫',
                explain: `<h3>📖 快速排序原理</h3>
        採用<b>分而治之 (Divide and Conquer)</b> 策略<br>
        從陣列中挑選一個元素作為<b>基準 (Pivot)</b><br>
        將小於基準的元素移到左邊，大於的移到右邊<br>
        對左右兩邊子陣列重複上述步驟<br>
        <br>
        ⏱ 時間複雜度：平均 O(n log n)，最差 O(n²)`
            }
        };

        const speedSlider = document.getElementById('speedSlider');
        const speedLabel = document.getElementById('speedLabel');
        const labels = ['', '極慢', '慢', '慢', '中慢', '中', '中快', '快', '快', '極快', '最快'];
        speedSlider.oninput = () => speedLabel.textContent = labels[speedSlider.value];

        function getDelay() {
            const v = parseInt(speedSlider.value);
            return Math.round(1000 / (v * 1.5));
        }

        async function sleep(ms) {
            await new Promise(resolve => setTimeout(resolve, ms));
            while (isPaused) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }

        function togglePause() {
            if (!sorting) return;
            isPaused = !isPaused;
            const btn = document.getElementById('pauseBtn');
            if (isPaused) {
                btn.innerHTML = '▶ 繼續';
                btn.style.background = '#ffd93d';
                btn.style.color = '#333';
            } else {
                btn.innerHTML = '⏸ 暫停';
                btn.style.background = '#4a9eff';
                btn.style.color = 'white';
            }
        }

        function resetArray() {
            if (sorting) return;
            arr = Array.from({length: 8}, () => Math.floor(Math.random() * 9) + 1);
            comparisons = 0; swaps = 0;
            document.getElementById('roundCount').textContent = '0';
            updateStats();
            renderBars(arr, [], []);
            setInfo('準備就緒', algoData[currentAlgo]?.readyDesc || '按「開始排序」來觀看排序動畫');
        }

        function renderBars(arr, comparing = [], sorted = [], swapping = []) {
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
        }

        function updateStats() {
            document.getElementById('compCount').textContent = comparisons;
            document.getElementById('swapCount').textContent = swaps;
        }

        function setInfo(title, desc) {
            document.getElementById('infoBox').innerHTML =
                `<div class="step-title">${title}</div><div class="step-desc">${desc}</div>`;
        }

        async function startSort() {
            if (sorting || arr.length === 0) return;
            sorting = true;
            document.getElementById('startBtn').disabled = true;
            document.getElementById('resetBtn').disabled = true;
            
            const pauseBtn = document.getElementById('pauseBtn');
            pauseBtn.disabled = false;
            
            comparisons = 0; swaps = 0;

            if (currentAlgo === 'bubble') {
                await runBubbleSort();
            } else if (currentAlgo === 'selection') {
                await runSelectionSort();
            } else if (currentAlgo === 'insertion') {
                await runInsertionSort();
            } else if (currentAlgo === 'merge') {
                await runMergeSort();
            } else if (currentAlgo === 'quick') {
                await runQuickSort();
            }

            sorting = false;
            isPaused = false;
            const pauseBtn = document.getElementById('pauseBtn');
            pauseBtn.disabled = true;
            pauseBtn.innerHTML = '⏸ 暫停';
            pauseBtn.style.background = '#4a9eff';
            pauseBtn.style.color = 'white';

            document.getElementById('startBtn').disabled = false;
            document.getElementById('resetBtn').disabled = false;
        }

        async function runBubbleSort() {
            const n = arr.length;
            const sortedIdx = [];

            for (let i = 0; i < n - 1; i++) {
                document.getElementById('roundCount').textContent = i + 1;
                setInfo(`🔁 第 ${i + 1} 輪`, `從左到右比較，把本輪最大值推到右邊`);
                let swapped = false;
                await sleep(getDelay());

                for (let j = 0; j < n - i - 1; j++) {
                    comparisons++;
                    updateStats();
                    renderBars(arr, [j, j+1], sortedIdx);
                    setInfo(`🔍 比較 [${j}]=${arr[j]} 和 [${j+1}]=${arr[j+1]}`,
                        arr[j] > arr[j+1]
                            ? `${arr[j]} > ${arr[j+1]}，需要交換 🔄`
                            : `${arr[j]} ≤ ${arr[j+1]}，不需交換 ✅`);
                    await sleep(getDelay());

                    if (arr[j] > arr[j+1]) {
                        renderBars(arr, [], sortedIdx, [j, j+1]);
                        await sleep(getDelay() * 0.8);
                        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
                        swaps++;
                        updateStats();
                        renderBars(arr, [], sortedIdx, [j, j+1]);
                        await sleep(getDelay() * 0.8);
                        swapped = true;
                    }
                }

                sortedIdx.push(n - 1 - i);
                renderBars(arr, [], sortedIdx);
                setInfo(`✨ 第 ${i + 1} 輪完成`, `${arr[n-1-i]} 已歸位到正確位置`);
                await sleep(getDelay() * 1.5);

                if (!swapped) {
                    setInfo('🎉 提前完成！', '本輪沒有任何交換，陣列已完全排序！');
                    break;
                }
            }

            // 全部標為已排序
            for (let k = 0; k < n; k++) if (!sortedIdx.includes(k)) sortedIdx.push(k);
            renderBars(arr, [], sortedIdx);
            setInfo('🏆 排序完成！', `共比較 ${comparisons} 次，交換 ${swaps} 次`);
        }

        async function runSelectionSort() {
            const n = arr.length;
            const sortedIdx = [];

            for (let i = 0; i < n - 1; i++) {
                document.getElementById('roundCount').textContent = i + 1;
                let minIdx = i;
                setInfo(`🔁 第 ${i + 1} 輪`, `目前未排序區從索引 [${i}] 開始，假設其為最小值`);
                renderBars(arr, [i], sortedIdx);
                await sleep(getDelay());

                for (let j = i + 1; j < n; j++) {
                    comparisons++;
                    updateStats();
                    renderBars(arr, [j, minIdx], sortedIdx);
                    setInfo(`🔍 比較 [${j}]=${arr[j]} 和 目前最小值 [${minIdx}]=${arr[minIdx]}`,
                        arr[j] < arr[minIdx]
                            ? `更新最小值索引為 ${j} `
                            : `未更新最小值`);
                    await sleep(getDelay());

                    if (arr[j] < arr[minIdx]) {
                        minIdx = j;
                        renderBars(arr, [minIdx], sortedIdx);
                        setInfo(`✨ 找到更小的值`, `新最小值為 ${arr[minIdx]} (索引 [${minIdx}])`);
                        await sleep(getDelay() * 0.8);
                    }
                }

                if (minIdx !== i) {
                    setInfo(`🔄 準備交換`, `將最小值 [${minIdx}]=${arr[minIdx]} 與前端 [${i}]=${arr[i]} 交換`);
                    renderBars(arr, [], sortedIdx, [i, minIdx]);
                    await sleep(getDelay());

                    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
                    swaps++;
                    updateStats();

                    renderBars(arr, [], sortedIdx, [i, minIdx]);
                    await sleep(getDelay());
                } else {
                    setInfo(`✅ 無需交換`, `當前值 ${arr[i]} 已經是未排序區的最小值`);
                    await sleep(getDelay());
                }

                sortedIdx.push(i);
                renderBars(arr, [], sortedIdx);
                setInfo(`✨ 第 ${i + 1} 輪完成`, `${arr[i]} 已歸位到正確位置`);
                await sleep(getDelay() * 1.5);
            }

            // 全部標為已排序
            for (let k = 0; k < n; k++) if (!sortedIdx.includes(k)) sortedIdx.push(k);
            renderBars(arr, [], sortedIdx);
            setInfo('🏆 排序完成！', `共比較 ${comparisons} 次，交換 ${swaps} 次`);
        }

        async function runInsertionSort() {
            const n = arr.length;
            const sortedIdx = [0]; // 第一個元素預設已排序

            for (let i = 1; i < n; i++) {
                document.getElementById('roundCount').textContent = i;
                let currentVal = arr[i];
                let j = i - 1;

                setInfo(`🔁 第 ${i} 輪`, `取出 [${i}]=${currentVal} 準備插入已排序區間`);
                renderBars(arr, [i], sortedIdx);
                await sleep(getDelay());

                while (j >= 0) {
                    comparisons++;
                    updateStats();
                    renderBars(arr, [j, j + 1], sortedIdx); // 比較
                    setInfo(`🔍 比較`, `目前元素 ${currentVal} 和 [${j}]=${arr[j]}`);
                    await sleep(getDelay());

                    if (arr[j] > currentVal) {
                        setInfo(`🔄 將 ${arr[j]} 往右移`, `因為 ${arr[j]} > ${currentVal}`);
                        renderBars(arr, [], sortedIdx, [j, j + 1]); 
                        await sleep(getDelay() * 0.8);
                        arr[j + 1] = arr[j];
                        swaps++;
                        updateStats();
                        renderBars(arr, [], sortedIdx, [j, j + 1]); 
                        await sleep(getDelay() * 0.8);
                        j--;
                    } else {
                        setInfo(`✅ 找到位置`, `${arr[j]} ≤ ${currentVal}，停止移動`);
                        await sleep(getDelay());
                        break;
                    }
                }
                
                arr[j + 1] = currentVal;
                // 加入已排序
                for (let k = 0; k <= i; k++) {
                    if (!sortedIdx.includes(k)) sortedIdx.push(k);
                }
                renderBars(arr, [], sortedIdx);
                setInfo(`✨ 第 ${i} 輪完成`, `${currentVal} 已插入到位置 [${j + 1}]`);
                await sleep(getDelay() * 1.5);
            }

            // 全部標為已排序
            for (let k = 0; k < n; k++) {
                if (!sortedIdx.includes(k)) sortedIdx.push(k);
            }
            renderBars(arr, [], sortedIdx);
            setInfo('🏆 排序完成！', `共比較 ${comparisons} 次，移動 ${swaps} 次`);
        }

        async function runMergeSort() {
            const n = arr.length;
            const sortedIdx = [];
            
            async function merge(start, mid, end) {
                let temp = [];
                let i = start, j = mid + 1;
                
                while (i <= mid && j <= end) {
                    comparisons++;
                    updateStats();
                    renderBars(arr, [i, j], sortedIdx);
                    setInfo(`🔍 比較`, `比較左半部 [${i}]=${arr[i]} 和右半部 [${j}]=${arr[j]}`);
                    await sleep(getDelay());
                    
                    if (arr[i] <= arr[j]) {
                        temp.push(arr[i++]);
                    } else {
                        temp.push(arr[j++]);
                    }
                }
                while (i <= mid) temp.push(arr[i++]);
                while (j <= end) temp.push(arr[j++]);
                
                for (let k = start; k <= end; k++) {
                    arr[k] = temp[k - start];
                    swaps++; // 算作寫入（合併的陣列更新概念）
                    updateStats();
                    renderBars(arr, [k], sortedIdx, [k]);
                    setInfo(`🔄 合併寫入`, `將 ${arr[k]} 寫回位置 [${k}]`);
                    await sleep(getDelay() * 0.8);
                }
            }

            async function mergeSortHelper(start, end) {
                if (start >= end) return;
                const mid = Math.floor((start + end) / 2);
                setInfo(`✂️ 分割陣列`, `將區間 [${start}~${end}] 分為 [${start}~${mid}] 和 [${mid+1}~${end}]`);
                await sleep(getDelay());
                
                await mergeSortHelper(start, mid);
                await mergeSortHelper(mid + 1, end);
                
                setInfo(`🧬 準備合併`, `合併區間 [${start}~${mid}] 和 [${mid+1}~${end}]`);
                await sleep(getDelay());
                await merge(start, mid, end);
            }

            document.getElementById('roundCount').textContent = '-';
            await mergeSortHelper(0, n - 1);
            
            for (let k = 0; k < n; k++) sortedIdx.push(k);
            renderBars(arr, [], sortedIdx);
            setInfo('🏆 排序完成！', `共比較 ${comparisons} 次，陣列寫入 ${swaps} 次`);
        }

        async function runQuickSort() {
            const n = arr.length;
            const sortedIdx = [];

            async function partition(low, high) {
                const pivot = arr[high];
                let i = low - 1;

                setInfo(`🎯 選擇基準`, `以區間最後一個元素 [${high}]=${pivot} 作為基準(Pivot)`);
                renderBars(arr, [high], sortedIdx);
                await sleep(getDelay() * 1.5);

                for (let j = low; j < high; j++) {
                    comparisons++;
                    updateStats();
                    renderBars(arr, [j, high], sortedIdx); 
                    setInfo(`🔍 比較`, `檢查 [${j}]=${arr[j]} 是否小於基準 ${pivot}`);
                    await sleep(getDelay());

                    if (arr[j] < pivot) {
                        i++;
                        if (i !== j) {
                            setInfo(`🔄 交換`, `因為 ${arr[j]} < ${pivot}，將其與 [${i}]=${arr[i]} 交換`);
                            renderBars(arr, [], sortedIdx, [i, j]);
                            await sleep(getDelay() * 0.8);
                            [arr[i], arr[j]] = [arr[j], arr[i]];
                            swaps++;
                            updateStats();
                            renderBars(arr, [], sortedIdx, [i, j]);
                            await sleep(getDelay() * 0.8);
                        }
                    }
                }
                
                i++;
                if (i !== high) {
                    setInfo(`🔄 基準歸位`, `將基準 ${pivot} 移動到正確位置 [${i}]`);
                    renderBars(arr, [], sortedIdx, [i, high]);
                    await sleep(getDelay() * 0.8);
                    [arr[i], arr[high]] = [arr[high], arr[i]];
                    swaps++;
                    updateStats();
                    renderBars(arr, [], sortedIdx, [i, high]);
                    await sleep(getDelay() * 0.8);
                } else {
                    setInfo(`✅ 基準歸位`, `基準 ${pivot} 位置 [${i}] 已正確`);
                    await sleep(getDelay());
                }

                sortedIdx.push(i);
                renderBars(arr, [], sortedIdx);
                return i;
            }

            async function quickSortHelper(low, high) {
                if (low < high) {
                    const pi = await partition(low, high);
                    await quickSortHelper(low, pi - 1);
                    await quickSortHelper(pi + 1, high);
                } else if (low === high) {
                    if (!sortedIdx.includes(low)) sortedIdx.push(low);
                    renderBars(arr, [], sortedIdx);
                }
            }

            document.getElementById('roundCount').textContent = '-';
            await quickSortHelper(0, n - 1);
            
            for (let k = 0; k < n; k++) if (!sortedIdx.includes(k)) sortedIdx.push(k);
            renderBars(arr, [], sortedIdx);
            setInfo('🏆 排序完成！', `共比較 ${comparisons} 次，交換 ${swaps} 次`);
        }

        resetArray();

        function showSort(algo) {
            currentAlgo = algo;
            const data = algoData[algo] || algoData.bubble;
            document.getElementById('algoTitle').innerHTML = data.title;
            document.getElementById('algoSubtitle').innerHTML = data.subtitle;
            document.getElementById('algoExplain').innerHTML = data.explain;

            document.getElementById('page-home').style.display = 'none';
            const sort = document.getElementById('page-sort');
            sort.style.display = 'flex';
            resetArray();
        }

        function showHome() {
            if (sorting) return; // Prevent returning if playing
            document.getElementById('page-sort').style.display = 'none';
            document.getElementById('page-home').style.display = 'flex';
        }
    