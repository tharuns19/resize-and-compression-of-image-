// ===== HUFFMAN CODING LOGIC =====
class HuffmanNode {
    constructor(char, freq, left = null, right = null) {
      this.char = char; // Pixel value (0-255)
      this.freq = freq;  // Frequency of pixel
      this.left = left;
      this.right = right;
    }
  }
  
  function buildFrequencyTable(data) {
    const freqTable = {};
    for (const byte of data) {
      freqTable[byte] = (freqTable[byte] || 0) + 1;
    }
    return freqTable;
  }
  
  function buildHuffmanTree(freqTable) {
    const nodes = [];
    for (const [byte, freq] of Object.entries(freqTable)) {
      nodes.push(new HuffmanNode(byte, freq));
    }
  
    while (nodes.length > 1) {
      nodes.sort((a, b) => a.freq - b.freq);
      const left = nodes.shift();
      const right = nodes.shift();
      nodes.push(new HuffmanNode(null, left.freq + right.freq, left, right));
    }
    return nodes[0];
  }
  
  function buildCodebook(tree, prefix = '', codebook = {}) {
    if (tree.char !== null) {
      codebook[tree.char] = prefix;
      return codebook;
    }
    buildCodebook(tree.left, prefix + '0', codebook);
    buildCodebook(tree.right, prefix + '1', codebook);
    return codebook;
  }
  
  function encodeData(data, codebook) {
    let binaryString = '';
    for (const byte of data) {
      binaryString += codebook[byte];
    }
    return binaryString;
  }
  
  // ===== IMAGE RESIZING + HUFFMAN COMPRESSION =====
  const huffmanCheckbox = document.querySelector(".huffman input");
  
  async function resizeAndCompress() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = widthInput.value;
    canvas.height = heightInput.value;
    ctx.drawImage(previewImg, 0, 0, canvas.width, canvas.height);
  
    // Get image pixel data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixelData = imageData.data; // Uint8Array (RGBA)
  
    if (huffmanCheckbox.checked) {
      // Convert RGBA to grayscale (simplified example)
      const grayscaleData = [];
      for (let i = 0; i < pixelData.length; i += 4) {
        const gray = Math.round(0.299 * pixelData[i] + 0.587 * pixelData[i+1] + 0.114 * pixelData[i+2]);
        grayscaleData.push(gray);
      }
  
      // Huffman compression
      const freqTable = buildFrequencyTable(grayscaleData);
      const huffmanTree = buildHuffmanTree(freqTable);
      const codebook = buildCodebook(huffmanTree);
      const compressedBinary = encodeData(grayscaleData, codebook);
  
      // Download as binary file
      const blob = new Blob([compressedBinary], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "compressed.bin";
      a.click();
    } else {
      // Original download (JPEG)
      const imgQuality = qualityInput.checked ? 0.7 : 1.0;
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "resized.jpg";
        a.click();
      }, "image/jpeg", imgQuality);
    }
  }
  
  downloadBtn.addEventListener("click", resizeAndCompress);