<template>
    <div id='header'>
        <div class="header">
            <img class="logo" src="@/assets/logo.png" alt="">
            <a class="btn" href="javascript:;">Vue</a>
        </div>
    </div>
</template>

<script>

</script>

<style scoped>
    .header{
        top: 0;
        right: 0;
        left: 0;
        z-index: 100;
        position: fixed;
        display: -webkit-box;
        -webkit-box-pack: justify;
        -webkit-box-align: center;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        box-shadow: 0 5px 5px rgba(0,0,0,.02);
        background: #fff;
        width: 100%;
        height: 80px;
        padding: 0 10px;
    }
    .header .logo{
        width: 126.66px;
        height: 35px;
    }
    .btn{
        display: block;
        min-width: 40px;
        height: 25px;
        line-height: 25px;
        padding: 0 10px;
        margin-right: 20px;
        text-align: center;
        font-size: 14px;
        color: #000;
        border: solid 1px rgba(0,0,0,.3);
        border-radius: 25px;
        text-decoration: none;
    }
</style>