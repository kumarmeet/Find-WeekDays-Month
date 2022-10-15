getBookedDatesApp: async (_, { input }, { model }) => {
      const { month, year, service_type, center_id, offer_id, pet_type } =
        input;

      const weekdays = ["0", "1", "2", "3", "4", "5", "6"];

      const center = await model.centers.one({ id: center_id });

      const daysInMonth = moment(`${year}${month}`, "YYYY-MM").daysInMonth();

      const workingDays = JSON.parse(center.working_days);
      const weekOffDays = weekdays.filter((val) => !workingDays.includes(val));

      let start = moment(`${year}-${month}-01`).startOf("month");
      let end = moment(`${year}-${month}-${daysInMonth}`).endOf("month");

      const [_d] = weekOffDays;

      const result = [];

      let fromDate = +moment(start).format("YYYY-MM-DD").split("-")[2];
      let endDate = +moment(end).format("YYYY-MM-DD").split("-")[2];

      const temp = moment(`${year}-${month}-01`)
        .day(+_d + 1)
        .format("dddd");

      while (fromDate <= endDate) {
        if (fromDate <= 9) {
          result.push(`${year}-${month}-0${fromDate}`);
        } else {
          result.push(`${year}-${month}-${fromDate}`);
        }
        fromDate++;
      }

      const blockedDates = await (
        await model.blockedDates.getBlockedDates(center.id)
      ).singleAndRangeDates;

      const filterMonthFromBlockedDates = blockedDates.filter((val) =>
        val.includes(`-${month}-`)
      );

      const todayDate = moment().format("YYYY-MM-DD").split("-")[2];
      const currentTime = moment().format("YYYY-MM-DD HH").split(" ")[1];

      let data = null;

      //if input method is same
      if (moment(`${year}-${month}-01`).isSame(moment(), "month")) {
        data = result.map((val) => {
          let isWeekDayOff = moment(val).format("dddd").includes(temp);

          let isBlokedDate =
            filterMonthFromBlockedDates.includes(val) ||
            moment(val).isBefore(`${year}-${month}-${todayDate}`);

          if (+service_type === 1 || +service_type === 3) {
            if (+currentTime >= 16 && moment(val).isSame(moment(), "day")) {
              isBlokedDate = true;
            }
          }

          return {
            date: val,
            isBlokedDate: isBlokedDate,
            isWeekDayOff: isWeekDayOff,
          };
        });
      } else {
        data = result.map((val) => {
          let isWeekDayOff = moment(val).format("dddd").includes(temp);

          let isBlokedDate = filterMonthFromBlockedDates.includes(val);

          return {
            date: val,
            isBlokedDate: isBlokedDate,
            isWeekDayOff: isWeekDayOff,
          };
        });
      }

      return data;
    },
