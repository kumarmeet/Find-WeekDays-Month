getBookedDatesApp: async (_, { input }, { model }) => {
      const { month, year, service_type, center_id, offer_id, pet_type } =
        input;

      const weekdays = ["0", "1", "2", "3", "4", "5", "6"]; //monday start from 0

      const center = await model.centers.one({ id: center_id });

      const daysInMonth = moment(`${year}${month}`, "YYYY-MM").daysInMonth();

      const workingDays = JSON.parse(center.working_days);
      const weekOffDays = weekdays.filter((val) => !workingDays.includes(val));

      let start = moment(`${year}-${month}-01`).startOf("month");
      let end = moment(`${year}-${month}-${daysInMonth}`).endOf("month");
      const day = 1; //due to weekdays array start from 0 it is showing monday that's why day has initialized with 1

      const result = [];
      const current = start.clone();

      weekOffDays.map((val) => {
        while (current.day(+val + day).isBefore(end)) {
          result.push(current.clone().format("YYYY-MM-DD"));
          console.log(result);
        }
      });

      return result;
    },
  },
