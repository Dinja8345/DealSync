"use server"

import axios from "axios";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials:{
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    },
});

const uploadImageToS3andDB = async(img: File, uuid: string, userId: string, iconUrl?: string) => {
    const arrayBuffer = await img.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const extension = img.name.substring(img.name.indexOf('.'));

    try{
        const s3PutResult = await s3.send(
            new PutObjectCommand({
                Bucket: 'dealsync',
                Key: "UserIcons/" + uuid + extension,
                Body: buffer
            })
        );

        // 前回の画像が存在すれば、s3ストレージから削除する。
        if(iconUrl){
            const preImgUrl = iconUrl;
            const startIndex = preImgUrl.indexOf("UserIcons");
    
            if(startIndex !== -1){
                const deleteTarget =  preImgUrl.slice(startIndex);
                const s3DeleteResult = await s3.send(
                    new DeleteObjectCommand({
                    Bucket: 'dealsync',
                    Key: deleteTarget
                }));

                console.log(s3DeleteResult);
            }
        }
        
        const mongoResult = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/user`, {
            query: "changeUserIcon",
            id: userId,
            imgUrl: `${process.env.IMGIX_BASEURL}UserIcons/${uuid + extension}`
        });

    }catch(e){
        console.log("S3SendError: " + e);
    }
}

export { uploadImageToS3andDB };