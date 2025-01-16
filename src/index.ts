import express from "express";
import jwt from "jsonwebtoken";
import { UserModel, ContentModel, LinkModel } from "./db";
import { userMiddleware } from "./middleware";
import dotenv from "dotenv";
import { random } from "./utils";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

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
    const type = req.body.type;
    const title = req.body.title;
    await ContentModel.create({
        link,
        title,
        type,
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
        const existingLink = await LinkModel.findOne({
            //@ts-ignore
            userId: req.userId
        });

        if (existingLink) {
            res.json({
                hash: existingLink.hash
            });
            return;
        }

        const hash = random(10)
        await LinkModel.create({
            //@ts-ignore
            userId: req.userId,
            hash: hash
        });

        res.json({
            message: `/share/${hash}`
        });
    } else {
        LinkModel.deleteOne({
            //@ts-ignore
            userId: req.userId
        });

        res.json({
            message: "Removed link"
        });
    }
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;

    const link = await LinkModel.findOne({
        hash
    });

    if (!link) {
        res.status(404).json({
            message: "Resource not found"
        });
        return;
    }

    const content = await ContentModel.find({
        userId: link.userId
    })

    const user = await UserModel.findOne({
        _id: link.userId
    });

    if (!user) {
        res.status(404).json({
            message: "User not found"
        });
        return;
    }

    res.json({
        username: user.username,
        content: content
    })
});

app.listen(3000);