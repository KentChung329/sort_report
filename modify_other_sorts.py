import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update renderBars to support pivot styling and sorted section dimming
old_renderBars_extras = """                if (extras.gapAt === i) {
                    styleStr += "margin-right: 40px;";
                }
                if (extras.dimOutside && (i < extras.dimOutside[0] || i > extras.dimOutside[1])) {
                    styleStr += "opacity: 0.15;";
                }"""

new_renderBars_extras = """                if (extras.gapAt === i) {
                    styleStr += "margin-right: 40px;";
                }
                if (extras.dimOutside && (i < extras.dimOutside[0] || i > extras.dimOutside[1])) {
                    styleStr += "opacity: 0.15;";
                }
                if (extras.pivot === i) {
                    styleStr += "box-shadow: 0 0 15px #f472b6, inset 0 0 10px #f472b6; border: 2px solid #f472b6;";
                }"""

content = content.replace(old_renderBars_extras, new_renderBars_extras)

# We need to systematically rewrite the animation lines for Selection, Insertion, Quick Sort

# --- Quick Sort ---
# Old partition render:
# renderBars(arr, [high], sortedIdx); -> renderBars(arr, [high], sortedIdx, [], { dimOutside: [low, high], pivot: high });
content = re.sub(r'renderBars\(arr, \[high\], sortedIdx\);', r'renderBars(arr, [high], sortedIdx, [], { dimOutside: [low, high], pivot: high });', content)
content = re.sub(r'renderBars\(arr, \[j, high\], sortedIdx\);', r'renderBars(arr, [j, high], sortedIdx, [], { dimOutside: [low, high], pivot: high });', content)
content = re.sub(r'renderBars\(arr, \[\], sortedIdx, \[i, j\]\);', r'renderBars(arr, [], sortedIdx, [i, j], { dimOutside: [low, high], pivot: high });', content)
content = re.sub(r'renderBars\(arr, \[\], sortedIdx, \[i, high\]\);', r'renderBars(arr, [], sortedIdx, [i, high], { dimOutside: [low, high], pivot: high });', content)

# --- Selection Sort ---
# Dim previous elements because they are sorted, focus on finding min in [i, n-1]
content = re.sub(r'renderBars\(arr, \[i\], sortedIdx\);', r'renderBars(arr, [i], sortedIdx, [], { dimOutside: [i, n - 1] });', content)
content = re.sub(r'renderBars\(arr, \[j, minIdx\], sortedIdx\);', r'renderBars(arr, [j, minIdx], sortedIdx, [], { dimOutside: [i, n - 1] });', content)
content = re.sub(r'renderBars\(arr, \[minIdx\], sortedIdx\);', r'renderBars(arr, [minIdx], sortedIdx, [], { dimOutside: [i, n - 1] });', content)
content = re.sub(r'renderBars\(arr, \[\], sortedIdx, \[i, minIdx\]\);', r'renderBars(arr, [], sortedIdx, [i, minIdx], { dimOutside: [i, n - 1] });', content)

# --- Insertion Sort ---
# Focus on the element being inserted
content = re.sub(r'renderBars\(arr, \[i\], sortedIdx\);', r'renderBars(arr, [i], sortedIdx, [], { dimOutside: [0, i] });', content)
content = re.sub(r'renderBars\(arr, \[j, j \+ 1\], sortedIdx\);(.*?)// 比較', r'renderBars(arr, [j, j + 1], sortedIdx, [], { dimOutside: [0, i] }); \1// 比較', content)
content = re.sub(r'renderBars\(arr, \[\], sortedIdx, \[j, j \+ 1\]\);', r'renderBars(arr, [], sortedIdx, [j, j + 1], { dimOutside: [0, i] });', content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated quick, selection, insertion animations.')
