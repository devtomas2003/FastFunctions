export async function CreateLambda(req, res){
    res.status(200).json({
        "hello": "world"
    });
}