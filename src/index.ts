import express from "express";
import jwt from "jsonwebtoken";
import { UserModel, ContentModel, LinkModel } from "./db";
import { userMiddleware } from "./middleware";
import dotenv from "dotenv";
import { random } from "./utils";

dotenv.config();

const app = express();
app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
    //add zod validation
    const username = req.body.username;
    const password = req.body.password;

    try {
        await UserModel.create({
            username: username,
            password: password
        });
    
        res.json({
            message: "User signed up"
        });
    } catch(e) {
        res.status(403).json({
            message: "Username already taken"
        });
    }
    
});

app.post("/api/v1/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = await UserModel.findOne({
        username,
        password
    });

    if (existingUser) {
        const token = jwt.sign({
            id: existingUser._id
        }, process.env.JWT_PASSWORD!);

        res.json({
            token
        })
    } else {
        res.status(404).json({
            message: "Incorrect credentials!"
        });
    }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
    const link = req.body.link;
    const title = req.body.title;
    await ContentModel.create({
        link,
        title,
        //@ts-ignore
        userId: req.userId,
        tags: []
    });

    res.json({
        message: "Content added"
    });

});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({
        userId: userId
    }).populate("userId", "username");
    res.json({
        content
    });
});

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
    const contentId = req.body.contentId;

    await ContentModel.deleteMany({
       contentId,
       //@ts-ignore
       userId: req.userId 
    });

    res.json({
        message: "Content deleted"
    });
});

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
    const share = req.body.share;
    if (share) {
        await LinkModel.create({
            //@ts-ignore
            userId: req.userId,
            hash: random(10)
        })
    } else {
        LinkModel.deleteOne({
            //@ts-ignore
            userId: req.userId
        });
    }

    res.json({
        message: "Updated sharable link"
    });
});

app.get("/api/v1/brain/shareLink", (req, res) => {

});

app.listen(3000);