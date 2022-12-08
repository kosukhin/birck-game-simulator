<template>
    <div class="offer middle">
        <h1>{{ $services.lang.t('Offer a game') }}</h1>
        <div v-show="isSuccessSubmitted">
            <el-result
                icon="success"
                :title="$services.lang.t('Thanks for offer')"
            >
                <template #extra>
                    <div class="offer__description">
                        <p>
                            {{
                                $services.lang.t(
                                    'Unfortunately, this is a demo form, but you can'
                                )
                            }}
                        </p>
                        <p>
                            {{ $services.lang.t('send the results by email') }}:
                            kosuha606@gmail.com
                        </p>
                    </div>
                    <el-button type="primary" @click="submitAgain">
                        {{ $services.lang.t('Back') }}
                    </el-button>
                    <el-table
                        class="offer__result"
                        :data="Object.entries(formState)"
                        style="width: 100%"
                    >
                        <el-table-column
                            prop="0"
                            :label="$services.lang.t('Field')"
                        />
                        <el-table-column
                            prop="1"
                            :label="$services.lang.t('Result')"
                        />
                    </el-table>
                </template>
            </el-result>
        </div>
        <el-form
            v-show="!isSuccessSubmitted"
            ref="formRef"
            :model="formState"
            :rules="formRules"
        >
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item
                        :label="$services.lang.t('What is your name?')"
                        prop="name"
                    >
                        <el-input
                            v-model="formState.name"
                            name="name"
                            :placeholder="$services.lang.t('John Smith')"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$services.lang.t('Post')" prop="duty">
                        <el-input
                            v-model="formState.duty"
                            name="duty"
                            :placeholder="$services.lang.t('Developer')"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item
                        :label="$services.lang.t('Work experience, years')"
                        prop="expiriense"
                    >
                        <el-slider
                            v-model="formState.expiriense"
                            :max="20"
                            :min="0"
                            name="expiriense"
                            show-input
                        ></el-slider>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item
                        :label="$services.lang.t('Describe the offer')"
                        prop="description"
                    >
                        <el-input
                            v-model="formState.description"
                            name="description"
                            type="textarea"
                            :placeholder="`${$services.lang.t('Cool game')}...`"
                            :maxlength="800"
                            show-word-limit
                            rows="13"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12" :offset="6">
                    <el-button
                        class="offer-form__button"
                        type="primary"
                        @click="submitForm(formRef)"
                    >
                        {{ $services.lang.t('Send') }}
                    </el-button>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { FormRules, FormInstance } from 'element-plus'
import { useService } from '~~/src/Common/Helpers/HService'
import { SLanguage } from '~~/src/Common/Services/SLanguage'

const lang = useService<SLanguage>('lang')
const formRef = ref()
const formState = reactive({
    name: '',
    duty: '',
    expiriense: 0,
    description: '',
})
const formRules = reactive<FormRules>({
    name: [
        {
            required: true,
            message: () => lang.t('Need your name'),
            trigger: 'blur',
        },
    ],
    duty: [
        {
            required: true,
            message: () => lang.t('Need your post'),
            trigger: 'blur',
        },
    ],
    expiriense: [
        {
            required: true,
            message: () => lang.t('Need your experience'),
            trigger: 'blur',
        },
    ],
    description: [
        {
            required: true,
            message: () => lang.t('Need description'),
            trigger: 'blur',
        },
    ],
})
const isSuccessSubmitted = ref(false)

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return

    await formEl.validate((valid) => {
        if (valid) {
            isSuccessSubmitted.value = true
        }
    })
}

const resetForm = () => {
    if (!formRef.value) return
    formRef.value.resetFields()
}

const submitAgain = () => {
    isSuccessSubmitted.value = false
    resetForm()
}
</script>

<style scoped lang="scss">
.el-row {
    margin-bottom: 20px;
}

.el-form-item {
    display: block;
}

.offer {
    max-width: 600px;

    &__description {
        font-size: 14px;
        margin-bottom: 50px;
    }

    &__result {
        margin-top: 40px;
    }
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
