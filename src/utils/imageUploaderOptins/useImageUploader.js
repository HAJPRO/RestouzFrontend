// composables/useImageUploader.js
import { ref } from "vue";
import { ElMessage } from "element-plus";

const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const imagesList = ref([]);
const limit = ref(7);
const MAX_SIZE_MB = 1;

// Yuklashdan oldin tekshirish
const handleBeforeUpload = (file) => {
    const isLtMax = file.size / 1024 / 1024 < MAX_SIZE_MB;
    if (!isLtMax) {
        ElMessage.error(`Rasm hajmi ${MAX_SIZE_MB} MB dan oshmasligi kerak.`);
        return false;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        imagesList.value.push({
            name: file.name,
            url: e.target.result, // base64
            uid: file.uid || Date.now(),
            status: "ready",
        });
    };
    reader.readAsDataURL(file);
    return false;
};

// Rasmni dialogda ko‘rsatish
const handlePictureCardPreview = (file) => {
    dialogImageUrl.value = file.url;
    dialogVisible.value = true;
};

// Rasmni o‘chirish
const handleRemove = (file) => {
    imagesList.value = imagesList.value.filter((img) => img.uid !== file.uid);
};

// Limit oshib ketganda
const handleExceed = () => {
    ElMessage.error(`Faqat ${limit.value} ta rasm yuklashingiz mumkin.`);
};



export {
    dialogImageUrl,
    dialogVisible,
    imagesList,
    limit,
    handleBeforeUpload,
    handlePictureCardPreview,
    handleRemove,
    handleExceed,
};
