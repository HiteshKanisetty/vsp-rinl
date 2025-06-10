const Memo = require("../models/memo");
const Wagon = require("../models/wagon");
const QRCode = require("qrcode");
const os = require("os");

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (
        iface.family === "IPv4" &&
        !iface.internal &&
        iface.address.startsWith("192.168.") // or "10." or "172." for other LANs
      ) {
        return iface.address;
      }
    }
  }
  return "127.0.0.1";
}
exports.getIndex = (req, res) => {
  res.render("index", {
    title: "Master Controller",
    message: "Welcome to the Master Controller!",
  });
};
exports.postmemo = async (req, res) => {
  const memoNo = req.body.memoNo;
  const memoDate = req.body.memoDate;
  const loadingPoint = req.body.loadingPoint;
  const loadingPointDesc = req.body.loadingPointDesc;
  const unloadingPoint = req.body.unloadingPoint;
  const unloadingPointDesc = req.body.unloadingPointDesc;
  const isUpdate = req.body.isUpdate === "true";

  // Accessing wagon data (assuming 10 wagons in the form)
  const wagons = [];
  for (let i = 0; i < 11; i++) {
    const wagonNumber = req.body[`wagonNo_${i}`];
    if (wagonNumber && wagonNumber.trim() !== "") {
      wagons.push({
        wagonNumber: wagonNumber,
        wagonType: req.body[`wagonType_${i}`],
        tare: req.body[`tare_${i}`],
        wagondate: req.body[`date_${i}`],
        remarks: req.body[`remarks_${i}`],
        selected: req.body[`selected_${i}`] === "on",
        challan_number: `1000${Math.floor(
          10000000 + Math.random() * 90000000
        )}`, // random challan number
      });
    }
  }

  // Create a new memo object
  const memo = {
    memoNumber: memoNo,
    date: memoDate,
    loadingPoint: {
      code: loadingPoint,
      description: loadingPointDesc,
    },
    unloadingPoint: {
      code: unloadingPoint,
      description: unloadingPointDesc,
    },
    wagons: wagons,
  };

  try {
    if (isUpdate) {
      // Update existing memo
      const updated = await Memo.findOneAndUpdate(
        { memoNumber: memoNo },
        memo,
        { new: true }
      );
      if (!updated) {
        return res.status(404).render("error", {
          title: "Not Found",
          message: "Memo not found for update.",
        });
      }
      return res.render("master-dash/newmemo.ejs", {
        title: "Memo Updated",
        message: "The memo has been updated successfully!",
        memo: {},
      });
    } else {
      // Insert new memo
      const result = await Memo.insertOne(memo);

      return res.render("master-dash/newmemo.ejs", {
        title: "Memo Created",
        message: "The memo has been created successfully!",
        memo: {},
      });
    }
  } catch (err) {
    console.error("Error saving memo:", err);
  }
};
exports.getMemoByNumber = async (req, res, next) => {
  try {
    const memoNumber = req.query.memo; // or req.params.memo if you want URL param
    if (!memoNumber) {
      return res.status(400).json({ error: "Memo number is required" });
    }

    const memo = await Memo.findOne({ memoNumber: memoNumber });
    if (!memo) return res.status(404).json({ error: "Memo not found" });

    res.json(memo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.postLoadingCompleted = async (req, res) => {
  try {
    const memoNumber = req.body.memoNumber;

    // Fetch the existing memo to get current challan numbers
    const existingMemo = await Memo.findOne({ memoNumber: memoNumber });

    // Build updated wagons array from form data
    const wagons = [];
    const assignedWagonNumbers = [];
    for (let i = 0; i < 11; i++) {
      const wagonNumber = req.body[`wagonNumber${i}`];
      if (wagonNumber && wagonNumber.trim() !== "") {
        assignedWagonNumbers.push(wagonNumber);
        // Use challan number from form if present, else fallback to DB value
        let challan_number = req.body[`challanNumber${i}`];
        if (
          (!challan_number || challan_number.trim() === "") &&
          existingMemo &&
          existingMemo.wagons[i]
        ) {
          challan_number = existingMemo.wagons[i].challan_number;
        }
        wagons.push({
          wagonNumber: wagonNumber,
          wagonType: req.body[`wagonType${i}`],
          tare: req.body[`tare${i}`],
          challan_number: challan_number,
          wagondate: req.body[`challanDate${i}`],
          releaseDate: req.body[`releaseDate${i}`],
          releaseTime: req.body[`releaseTime${i}`],
          remarks: req.body[`remarks${i}`],
          selected: req.body[`selected${i}`] === "on",
        });
      }
    }

    // Lock the assigned wagons for this memo
    await Wagon.updateMany(
      { wagonNumber: { $in: assignedWagonNumbers } },
      { $set: { isLocked: true, lockedByMemo: memoNumber } }
    );

    // Build update object
    const update = {
      date: req.body.date,
      loadingPoint: {
        code: req.body.loadingPoint1,
        description: req.body.loadingPoint2,
      },
      unloadingPoint: {
        code: req.body.unloadingPoint1,
        description: req.body.unloadingPoint2,
      },
      wagons: wagons,
    };

    // Update the memo by memoNumber
    const result = await Memo.findOneAndUpdate(
      { memoNumber: memoNumber },
      update,
      { new: true }
    );

    if (!result) {
      return res.status(404).render("error", {
        title: "Not Found",
        message: "Memo not found.",
      });
    }

    // Redirect to View 2
    return res.redirect("/newmemo?view2=1");
  } catch (err) {
    console.error("Error updating memo:", err);
  }
};
exports.getnewform = (req, res) => {
  res.render("master-dash/newwagon-form.ejs", {
    title: "New Memo Form",
    message: "Please fill out the memo form below.",
    memo: {}, // Pass an empty memo object to pre-fill the form
  });
};

exports.postnewwagon = async (req, res) => {
  const wagonNumber = req.body.wagonnumber;
  const wagonType = req.body.wagontype;

  // Format date to yyyy-mm-dd

  try {
    // Check if wagon number already exists
    const existing = await Wagon.findOne({ wagonNumber: wagonNumber });
    if (existing) {
      return res.render("master-dash/newwagon-form.ejs", {
        title: "Duplicate Wagon",
        message: "Wagon number already exists!",
        memo: {}, // Optionally, pre-fill form
      });
    }

    // Create and insert new wagon
    const newWagon = {
      wagonNumber: wagonNumber,
      wagonType: wagonType,
    };

    await Wagon.insertOne(newWagon);
    return res.render("master-dash/newwagon-form.ejs", {
      title: "New Wagon Created",
      message: "The new wagon has been created successfully!",
      memo: {},
    });
  } catch (err) {
    console.error("Error creating new wagon:", err);
    return res.status(500).render("error", {
      title: "Error",
      message: "An error occurred while creating the new wagon.",
    });
  }
};
exports.getAllWagons = async (req, res) => {
  try {
    const currentMemoNumber = req.query.memoNumber; // Pass this from frontend!
    let filter = {
      $or: [{ isLocked: false }, { lockedByMemo: currentMemoNumber }],
    };
    const wagons = await Wagon.find(filter);
    res.json(wagons);
  } catch (err) {
    console.error("Error fetching wagons:", err);
    res.status(500).render("error", {
      title: "Error",
      message: "An error occurred while fetching the wagons.",
    });
  }
};
// In mastercontroller.js
exports.getAllMemoNumbers = async (req, res) => {
  try {
    const memos = await Memo.find({}, "memoNumber").sort({ memoNumber: -1 });
    res.json(memos.map((m) => m.memoNumber));
  } catch (err) {
    res.status(500).json([]);
  }
};

exports.getWeightReport = async (req, res) => {
  const id = req.query.id;
  Memo.find({ memoNumber: id })
    .then((memo) => {
      if (!memo) {
        return res.status(404).render("error", {
          title: "Not Found",
          message: "Memo not found.",
        });
      }
      res.render("master-dash/weight-report.ejs", {
        title: "Weight Report",
        memo: memo,
      });
    })
    .catch((err) => {
      console.error("Error fetching memo:", err);
    });
};

exports.getLatestMemoNumber = async (req, res) => {
  try {
    const latestMemo = await Memo.findOne().sort({ memoNumber: -1 });
    if (!latestMemo) {
      return res.status(404).json({ error: "No memos found" });
    }
    res.json({ latestMemoNumber: latestMemo.memoNumber });
  } catch (error) {
    console.error("Error fetching latest memo number:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.postacknowledge = async (req, res) => {
  const { memoNumber, ack } = req.body;
  if (!memoNumber) return res.status(400).json({ error: "No memo number" });
  await Memo.updateOne({ memoNumber }, { $set: { acknowledged: ack } });
  res.json({ success: true });
};

exports.generateQR = async (req, res) => {
  const memoNumber = req.params.memoNumber;
  // The URL that will be encoded in the QR (mobile-friendly memo view)
  const ip = getLocalIp();
  // ...existing code...
  const qrDataUrl = `http://${ip}:2000/mobile-memo/${memoNumber}`;
  // const qrDataUrl = `https://vsp-rinl-production.up.railway.app/mobile-memo/${memoNumber}`;
  // ...existing code...
  try {
    const qrImage = await QRCode.toDataURL(qrDataUrl);
    res.render("master-dash/qr", {
      memoNumber,
      qrImage,
      qrDataUrl,
    });
  } catch (err) {
    res.status(500).send("Error generating QR code");
  }
};
exports.getmobile = async (req, res) => {
  const memoNumber = req.params.memoNumber;
  try {
    const memo = await Memo.findOne({ memoNumber });
    if (!memo) return res.status(404).send("Memo not found");
    res.render("master-dash/mobile-memo", { memo });
  } catch (err) {
    res.status(500).send("Server error");
  }
};
exports.getNewMemo = async (req, res) => {
  try {
    const memoNumber = req.query.memoNumber;
    let memo = {};
    if (memoNumber) {
      memo = await Memo.findOne({ memoNumber });
    }
    const showView2 = req.query.view2 === "1";
    res.render("master-dash/newmemo.ejs", {
      title: "Memo",
      memo,
      showView2,
    });
  } catch (err) {
    res.status(500).render("error", {
      title: "Error",
      message: "An error occurred while loading the memo.",
    });
  }
};

exports.unloading = async (req, res) => {
  try {
    const { memoNumber } = req.body;
    const memo = await Memo.findOne({ memoNumber });

    if (!memo) return res.status(404).json({ error: "Memo not found" });

    // Unlock wagons in Wagon DB
    if (memo.wagons && memo.wagons.length > 0) {
      const wagonNumbers = memo.wagons.map((w) => w.wagonNumber);
      await Wagon.updateMany(
        { wagonNumber: { $in: wagonNumbers } },
        { $set: { isLocked: false, lockedByMemo: null } }
      );
    }

    // DO NOT remove wagons from memo.wagons!
    // memo.wagons = [];
    memo.isUnloaded = true;
    await memo.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
