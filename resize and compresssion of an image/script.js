const uploadBox = document.querySelector(".upload-box"),
previewImg = document.querySelector("img"),
fileInput = uploadBox.querySelector("input"),
widthInput = document.querySelector(".width input"),
heightInput = document.querySelector(".height input"),
ratioInput = document.querySelector(".ratio input"),
qualityInput = document.querySelector(".quality input"),
downloadBtn = document.querySelector(".download-btn");

let ogImageRatio;

const loadFile = (e) => {
    const file = e.target.files[0]; // getting first user selected file
    if(!file) return; // RETURN IF  USER HASN'T selected any file
    previewImg.src = URL.createObjectURL(file); // PASSING SELECTED FILE URL TO PREVIEW IMG SRC
    previewImg.addEventListener("load", () => { // once img loaded
        widthInput.value = previewImg.naturalWidth;
        heightInput.value = previewImg.naturalHeight;
        ogImageRatio = previewImg.naturalWidth / previewImg.naturalHeight;

        document.querySelector(".wrapper").classList.add("active");
    });
    //console.log(file);
}

widthInput.addEventListener("keyup", () => {
    // getting height according to the ratio checkbox status
    const height = ratioInput.checked ? widthInput.value / ogImageRatio : heightInput.value;
    heightInput.value = Math.floor(height);
});
heightInput.addEventListener("keyup", () => {
    // getting width according to the ratio checkbox status
    const width = ratioInput.checked ? heightInput.value * ogImageRatio : widthInput.value;
    widthInput.value = Math.floor(width);
});

const resizeAndDownload = () => {
    const canvas = document.createElement("canvas");
    const a = document.createElement("a");
    const ctx = canvas.getContext("2d");

    
    // if quality checkbox is checked, pass 0.7 to omgQuality else pass 1.0
    // 1.0 is 100% quality where 0.7 is 70% of the total . you can pass from  0.1 - 1.0
    const imgQuality = qualityInput.checked ? 0.7 : 1.0;

    // setting canvas height and width according to the input values
    canvas.width = widthInput.value;
    canvas.height = heightInput.value;

    //drawing user selected image onto the canvas
    ctx.drawImage(previewImg, 0, 0, canvas.width, canvas.height);
    //document.body.appendChild(canvas);
    a.href = canvas.toDataURL("image/jpeg", imgQuality);
    a.download = new Date().getTime(); // passing current time as download value
    a.click(); // clicking <a> element so the  file download
}

downloadBtn.addEventListener("click", resizeAndDownload);
fileInput.addEventListener("change", loadFile);
uploadBox.addEventListener("click", () => fileInput.click());
