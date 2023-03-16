<template>
    <div class="bg_modal " > 
        <div class="box_modal  w-lg-50">
            <header class="modal-header">
                <h5 class="modal__title">{{this.title}}</h5>
                <button class="btn btn-danger" @click="close">X</button>
            </header>
            <section class="modal-body d-flex justify-content-center">
                <slot name="body">

                </slot>
            </section>
            <footer class="modal-footer d-flex justify-content-center">
                <slot name="footer">

                </slot>
            </footer>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Popup',
    data () {
        return {
            title : "ระบบการจ่ายยา",
        }
    },
    methods: {
        close() {
            this.$emit('close')
        }
    }
}
</script>

<style lang="scss">
.bg_modal{
    position: fixed;
    z-index: 999;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
}

.box_modal{
    position: relative;
    /* padding: 30px 30px 40px 30px; */
    width: 630px;
    z-index: 1000;
    background: #FFFFFF;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    &__title {
      font-weight: 600;
      font-size: 24px;
      display: block;
    //   color: var(--black-title);
      margin-bottom: 30px;
    }
    &-footer {
      margin-top: 30px;
      display: flex;
      align-items: center;
    }
}

.btn-close {
    position: absolute;
    top: 17px;
    right: 17px;
    border: none;
    cursor: pointer;
    font-weight: bold;
    color: #2196F3;
    background: transparent;
}

.modal-header{
    display: flex;
    justify-content: center;
    justify-items: center;
    background-color: black;
    color: #fff;
}
.modal__title{
    margin-top: auto;
    padding-bottom: auto;
    padding-left: 10px;
    font-weight: 600;
    font-size: 24px;
    display: block;
}

</style>