<template>
    <div class="offer">
        <h1>Предложить игру</h1>
        <el-form :model="formState" class="offer-form">
            <el-row :gutter="10">
                <el-col :span="12">
                    <div class="offer-form__label">Как вас зовут?</div>
                    <el-input
                        v-model="formState.name"
                        placeholder="Иванов Иван"
                    />
                </el-col>
                <el-col :span="12">
                    <div class="offer-form__label">Должность</div>
                    <el-input
                        v-model="formState.duty"
                        name="duty"
                        placeholder="Разработчик"
                    />
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <div class="offer-form__label">Опыт работы, лет</div>
                    <el-slider
                        v-model="formState.expiriense"
                        :max="20"
                        :min="0"
                        show-input
                    ></el-slider>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <div class="offer-form__label">Опишите предложение</div>
                    <el-input
                        v-model="formState.description"
                        type="textarea"
                        placeholder="Отличная игра..."
                        :maxlength="800"
                        show-word-limit
                        rows="13"
                    />
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12" :offset="6">
                    <el-button class="offer-form__button" type="primary"
                        >Отправить предложение</el-button
                    >
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
const formState = ref({
    name: '',
    duty: '',
    expiriense: 0,
    description: '',
})
</script>

<style scoped lang="scss">
.el-row {
    margin-bottom: 20px;
}

.offer-form {
    &__button {
        width: 100%;
    }

    &__label {
        font-size: 14px;
        margin-bottom: 8px;
    }
}
</style>
