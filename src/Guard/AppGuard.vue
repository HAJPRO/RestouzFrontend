<script setup>
import { computed, useSlots } from 'vue';
import { AuthStore } from '../stores/Auth/auth';

const props = defineProps({
  roles: { type: [String, Array], default: null },
  permission: { type: [String, Array], default: null },
  mode: { type: String, default: 'hide' }
});

const auth = AuthStore();
const slots = useSlots();

const hasAccess = computed(() => {
  console.log("Guard tekshiruvni boshladi..."); // SHU YERGA QO'SHING
  // 1. Foydalanuvchi ma'lumotlari yuklanmagan bo'lsa rad etish
  if (!auth.user || !auth.user.roles) return false;
  let roleOk = true;
  let permOk = true;

  // 2. Rollarni tekshirish (String formatiga o'girib solishtirish)
  if (props.roles) {
    console.log(props.roles)
    const allowed = Array.isArray(props.roles) ? props.roles.map(String) : [String(props.roles)];
    const userRoles = auth.user.roles.map(String);
    roleOk = allowed.some(r => userRoles.includes(r));
  }

  // 3. Permissionni tekshirish
 if (props.permission) {
  const requiredPerms = Array.isArray(props.permission) 
    ? props.permission.map(String) 
    : [String(props.permission)];
    
  const userPermissions = auth.user.permissions.map(String);
  
  // OR logic: permissionlardan biri bo'lsa yetarli
  permOk = requiredPerms.some(p => userPermissions.includes(p));
}

  return roleOk && permOk;
});
</script>

<template>
  <template v-if="slots.default">
    <template v-if="mode === 'hide'">
      <slot v-if="hasAccess" />
    </template>

    <template v-else>
      <div :class="{ 'opacity-50 pointer-events-none cursor-not-allowed select-none': !hasAccess }">
        <slot :disabled="!hasAccess" />
      </div>
    </template>
  </template>
</template>