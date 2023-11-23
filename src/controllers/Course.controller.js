const Course=require('../models/Course')

/**
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */

class CourseController{

    /**
     * create a new course
     */

    static async createCourse(request,response){
        const {name,description,price,instructorId}=request.body;

        //save course to database
        const courseData={name,description,price,instructorId}

        try {
            //create a new course
            const course=await Course.createNewCourse(courseData)

            const returnData={message:"Course Created Successfully",...course}
            return response.status(201).json(returnData)

        } catch (error) {
            return response.status(500).json({error:"Internal Server Error"})
        }
    }

    /**
     * retrieves a course by the id
     */
    static async getCourseById(request,response){
        const {id}=request.params;

        const courseId=parseInt(id,10);

        try {
            //check if course exists
            const course=await Course.getCourseById(courseId)
            if(!course){
                return response.status(400).json({error:"Course Not Found"})
            }

            return response.status(200).json({message:"Success",...course})
        } catch (error) {
            return response.status(500).json({error:"Internal Server Error"})
        }
    }

    /**
     * removes a course from the database by it's id
     */
    static async deleteCourse(request,response){
        const {id}=request.params;

        const courseId=parseInt(id,10)
        try {
            //check if the course exists
            const courseExists=await Course.getCourseById(courseId)

            if(!courseExists){
                return response(400).json({error:"Course Not Found"})
            }

            //delete course
            const courseIsDeleted=await Course.deleteCourse(courseId)
            if(!courseIsDeleted){
                throw new Error("Could Not Delete Course")
            }
            const toReturn={message:"success",id}
            return response.status(200).json(toReturn)
            
        } catch (error) {
            return response.status(500).json({error:"Internal Server Error"})
        }
    }
}


module.exports=CourseController