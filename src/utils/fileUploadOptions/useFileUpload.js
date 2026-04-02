// composables/useFileUpload.js
import { ref } from "vue";
import { ElMessage } from "element-plus";
export function useFileUpload(maxFileSize = 100 * 1024 * 1024) {
    const selectedFile = ref(null);
    const isFileUploaded = ref(false);
    const uploadProgress = ref(0);
    const FileUrl = ref(null);

    // ✅ Fayl yuklashdan oldin tekshirish
    const beforeUpload = (file) => {
        if (file.size > maxFileSize) {
            ElMessage.error(`File size should not exceed ${maxFileSize / (1024 * 1024)}MB!`);
            return false;
        }
        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        const isAllowed = allowedTypes.includes(file.type);
        if (!isAllowed) {
            ElMessage.error("Only PDF, DOC or DOCX files are allowed!");
        }
        return isAllowed;
    };

    // 📁 Fayl tanlanganida
    const handleFileChange = (file) => {
        selectedFile.value = file.raw || file;
        isFileUploaded.value = true;
        FileUrl.value = URL.createObjectURL(selectedFile.value);
    };

    // 🔄 Progress bar
    const handleProgress = (event) => {
        uploadProgress.value = Math.round(event.percent);
    };

    // ✅ Yuklash muvaffaqiyatli tugaganda
    const handleSuccess = (response, file) => {
        ElMessage.success("File uploaded successfully!");
        selectedFile.value = file.raw || file;
        isFileUploaded.value = true;
        setTimeout(() => {
            uploadProgress.value = 0;
        }, 1500);
    };

    // 📂 Faylni ko‘rsatish
    const viewFile = () => {
        if (!FileUrl.value) {
            ElMessage.error("File not found!");
            return;
        }
        window.open(FileUrl.value, "_blank");
    };

    // ❌ Faylni o‘chirish
    const removeFile = () => {
        selectedFile.value = null;
        isFileUploaded.value = false;
        FileUrl.value = null;
        uploadProgress.value = 0;
        ElMessage.warning("File removed!");
    };

    return {
        selectedFile,
        isFileUploaded,
        uploadProgress,
        FileUrl,
        beforeUpload,
        handleFileChange,
        handleProgress,
        handleSuccess,
        viewFile,
        removeFile,
    };
}
