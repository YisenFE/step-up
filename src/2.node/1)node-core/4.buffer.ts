/**
 * @file Buffer 用16进制读取文件
 */

// 声明一个固定长度的buffer
namespace _ {
    const buffer = Buffer.alloc(5);
    // console.log(buffer);

    // 固定内容
    const buffer1 = Buffer.from('百');
    console.log(buffer1, buffer1.toString());

    const arr: string[] = [];
    buffer1.forEach(i => {
        arr.push(i.toString(2));
    });

    // console.log(arr);


    const buffer2 = Buffer.from('我不要我觉得我只要你觉得'); // 3 * 8
    // console.log(buffer2.indexOf('觉得'))
    // console.log(buffer2[12].toString(16));
    // console.log(buffer2.length);
}



