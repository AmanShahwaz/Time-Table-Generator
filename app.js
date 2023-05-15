const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");
const { pid } = require("process");
const { truncate } = require("lodash");


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs')




let message = "Empty"

// database connections
mongoose.connect("mongodb://localhost:27017/TimeTableGenerator");

// Schema's
const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    faculty: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true
    },
    dept: {
        type: String,
        required: true
    }
});

const Course = new mongoose.model('course', courseSchema);


const ScheduleSchema = new mongoose.Schema({
    monday: [{ type: String }],
    tuesday: [{ type: String }],
    wednesday: [{ type: String }],
    thursday: [{ type: String }],
    friday: [{ type: String }]
  });
  
  const Schedule = mongoose.model('Schedule', ScheduleSchema);


  




//routes

app.get('/', function (req, res) {

    res.render('mainpage', {

    })

})


app.get('/addnewcourse', async (req, res) => {
    try {
        let courses = await Course.find();
        res.render('addnewcourse', {
            courses: courses
        })

    }
    catch (err) {
        res.send(err);
    }
})


app.post('/addnewcourse', async (req, res) => {

    try {
        const course = new Course({
            name: _.lowerCase(req.body.name),
            faculty: _.lowerCase(req.body.faculty),
            code: _.lowerCase(req.body.code),
            dept: _.lowerCase(req.body.department)
        })

        var created = await course.save()
        res.redirect('addnewcourse')


    }
    catch (err) {
        res.send({ err })
    }
})

app.get('/viewcompletedata', async (req, res) => {
    try {
        let courses = await Course.find();
        res.render('viewcompletedata', {
            courses: courses
        })

    }
    catch (err) {
        res.send(err);
    }
})



app.get('/viewtimetable', async (req, res) => {
    try {
        let courseNames = [];
        let courses = await Course.find();
        courses.forEach(course => {
            courseNames.push(course.name);
        });

        // console.log(courseNames.length);
        res.render('viewtimetable', {
            courses: courseNames
        })
    

    }
    catch (err) {
        res.send(err);
    }
})

app.get('/deleteaccount', (req, res) => {
    res.render('deleteaccount', {

    })
})


app.get('/deletefromdatabase', async (req, res) => {
    try {
        let courses = await Course.find();
        res.render('deletefromdatabase', {
            courses: courses
        })

    }
    catch (err) {
        res.send(err);
    }
})


app.get('/generatetimetable', (req, res) => {
    res.render('generatetimetable', {

    })
})

app.post('/deletefromdatabase', async (req, res) => {
    let toFindCode = _.lowerCase(req.body.code)
    let found = await Course.findOne({ code: toFindCode });

    // console.log(toFindCode+' '+found.code);

    if (found.code === toFindCode) {
        try {

            await Course.findOneAndDelete({ code: found.code })
            console.log("found and trying to delete " + found.code)
            res.redirect('deletefromdatabase')

        }
        catch (err) {
            console.log(err)
        }
    }
    else {
        console.log("Not found :(")
    }
}
)





app.get('/updatedatabase', async (req, res) => {
    message = "Empty"
    try {
        let courses = await Course.find();
        res.render('updatedatabase', {
            courses: courses,
            message: message
        })
    }
    catch (err) {
        res.send(err);
    }
})

app.post('/updatedatabase', async (req, res) => {
    message = "Empty"
    let toFindCode = _.lowerCase(req.body.code)
    let found = await Course.findOne({ code: toFindCode });
    if (found === null) {
        try {
            let courses = await Course.find();
            res.render('updatedatabase', {
                courses: courses,
                message: "No such Record found :("
            })
            message = "Empty"
        }
        catch (err) {
            res.send(err);
        }
    }
    else {
        message: null
        res.render('founddata', {
            found: found,
            message: "Empty"
        })
    }

}
)

app.get('/founddata', (req, res) => {
    res.render('founddata');
})


app.post('/founddata', async (req, res) => {
    const courseId = req.body.id; // Assuming the id of the course to update is provided in the request body

    // Create an object with the updated values
    const updatedCourse = {
        name: req.body.name,
        code: req.body.code,
        faculty: req.body.faculty,
        dept: req.body.department
    };


    console.log(updatedCourse);



    // Use findOneAndUpdate to update the course with the given ID
    try {
        await Course.findOneAndUpdate({ _id: courseId }, updatedCourse, { new: true });
        res.redirect('updatedatabase');

    } catch (err) {
        console.log(err)
        res.send(err)
    }

})


app.get('/updatetimetable', (req, res) => {
    res.render('updatetimetable', {

    })
})


app.get('/viewtimetable', (req, res) => {
    res.render('viewtimetable', {

    })
})

// app.get('/deletetimetable', (req, res) => {
//     res.render('deletetimetable', {

//     })
// })

app.get('/login', (req, res) => {
    res.render('login');
})






app.listen('8080', function () {
    console.log('Server is active on port 8080');
})








