import Video from "../model/videoModel";

export const toggleSubscribe = async (req, res) => {
  try {
    const { channelId } = req.body;
    const userId = req.userId;

    if (!channelId) {
      return res.status(400).json({
        success: false,
        message: "ChannelId is required",
      });
    }

    const channel = await Channel.findById(channelId);

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    const isSubscribed = channel.subscribers.includes(userId);

    if (isSubscribed) {
      channel.subscribers.pull(userId);
    } else {
      channel.subscribers.push(userId);
    }

    await channel.save();

    const updatedChannel = await Channel.findById(channelId)
      .populate("owner")
      .populate("videos")
      .populate("shorts");

    return res.status(200).json({
      success: true,
      subscribed: !isSubscribed,
      channel: updatedChannel,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addHistory = async (req,res) =>{
  try {
    const userId = req.userId;
    const {contentId,contentType} = req.body;  

    if(!["Video", "Short"].includes(contentType)){
        return res.status(400).json({message:"Invalid contentType"});
    }

    let content ;
    if(contentType === "Video") {
        content = await Video.findById(contentId);
    }else{
        content = await Short.findById(contentId);
    }

    if(!content ) return res.status(404).json({message:`${contentType} not found`});

    await UserActivation.findIdAndUpdate(userId,{
        $pull:{history:{contentId,contentType}}
    })

    await User.findByIdAndUpdate(userId,{
        $push:{
            history:{contentId,contentType,watchedAt:new Data()}
        }
    });
    res.status(200).json({message:"Added to history"})
  } catch (error) {
    console.log("addtoHistory error:",err);
    res.status(500).json({message:"server error"});
  }
}

export const getHistory = async (req,res)=>{
    try {
        const userId = req.userId;
        const user = await User.findById(userId)
        .populate({
            path:"history.contentId",
            populate:{
                path:"channel",
                select:"name avatar",
            },
        })
        .select("history");

        if(!user) return res.status(404).json({message:"User not found"});


        const sortedHistory = [...user.history].sort(
        (a,b) => new Date(b.watchedAt) - new Date(a.watchedAt)
        );

        res.status(200).json(sortedHistory);
    } catch (error) {
        console.error("History fetch error:",err);
        res.status(500).json({message:"server error"});
    }
}


export const 