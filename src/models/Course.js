
const {db,TABLES}=require('../db')


/**
 * Course class is defined here. It contains the actions that can be
 * performed on a row in the database `courses` table.
 */

class Course {
    static selectFields=[
        'id','name','description','price','instructorId'
    ];

    /**
     * @async
     * @param {*} courseInfo 
     */
    static async createNewCourse(courseInfo){
        //get the information needed to create a new course
        const {name,description,price,instructorId}=courseInfo;

        try {
            const data={name,description,price,instructorId}

            const [courseId]=await db(TABLES.COURSES).insert({...data})

            return {courseId,...data};
        } catch (error) {
            throw new Error("Course Creation Failed!")
        }
    }

    /**
     * @async
     * get a course by id
     * @param {string} courseId 
     */

    static async getCourseById(courseId){
        try {
            const course=await db(TABLES.COURSES).select(...this.selectFields).where({id:courseId}).first();
            if(!course){
                return null;
            }
            return Object.assign({},course)
        } catch (error) {
            throw new Error("Course Not Found")
        }
    }

    /**
     * deletes a course from the database
     * @param {string} courseId 
     */

    static async deleteCourse(courseId){
        try {
            //search for the course
            const course=await this.getCourseById(courseId);
            if(!course){
                throw new Error("Course Not Found!")
            }
            //delete course
            await db(TABLES.COURSES).where({id:courseId}).del()
            return true;
        } catch (error) {
            throw new Error('Unable To Delete Course')
        }
    }
 }

 module.exports=Course;