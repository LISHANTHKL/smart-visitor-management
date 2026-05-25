function RoomAvailability({
  visitors,
  darkMode,
}) {

  // =========================
  // UNIQUE ROOMS
  // =========================

  const uniqueRooms = [
    ...new Set(
      visitors.map(
        (visitor) => visitor.room_no
      )
    ),
  ];

  // =========================
  // ROOM STATUS
  // =========================

  const getRoomStatus = (roomNo) => {

    const activeVisitor = visitors.find(

      (visitor) =>

        visitor.room_no === roomNo

        &&

        (
          visitor.status === "approved"
          ||
          visitor.status === "checked_in"
        )
    );

    return activeVisitor
      ? "Occupied"
      : "Available";
  };

  // =========================
  // ROOM VISITOR
  // =========================

  const getRoomVisitor = (roomNo) => {

    const visitor = visitors.find(

      (visitor) =>

        visitor.room_no === roomNo

        &&

        (
          visitor.status === "approved"
          ||
          visitor.status === "checked_in"
        )
    );

    return visitor
      ? visitor.visitor_name
      : "-";
  };

  return (

    <div
      className={
        darkMode
          ? "bg-slate-800 p-5 rounded-xl shadow mt-8"
          : "bg-white p-5 rounded-xl shadow mt-8"
      }
    >

      {/* HEADER */}

      <div className="flex justify-between items-center mb-5">

        <h2 className="text-3xl font-bold">
          Room Availability
        </h2>

        {/* ROOM STATS */}

        <div className="flex gap-5">

          <div className="bg-blue-500 text-white px-5 py-2 rounded">

            Total Rooms:
            {" "}
            {uniqueRooms.length}

          </div>

          <div className="bg-green-500 text-white px-5 py-2 rounded">

            Available:
            {" "}

            {
              uniqueRooms.filter(
                room =>
                  getRoomStatus(room)
                  === "Available"
              ).length
            }

          </div>

          <div className="bg-red-500 text-white px-5 py-2 rounded">

            Occupied:
            {" "}

            {
              uniqueRooms.filter(
                room =>
                  getRoomStatus(room)
                  === "Occupied"
              ).length
            }

          </div>

        </div>

      </div>

      {/* TABLE */}

      <table className="w-full border">

        <thead className="bg-slate-800 text-white">

          <tr>

            <th className="p-3">
              Room No
            </th>

            <th className="p-3">
              Status
            </th>

            <th className="p-3">
              Visitor
            </th>

          </tr>

        </thead>

        <tbody>

          {uniqueRooms.map((roomNo) => (

            <tr
              key={roomNo}
              className="border-b text-center"
            >

              {/* ROOM */}

              <td className="p-3 font-bold">

                {roomNo}

              </td>

              {/* STATUS */}

              <td className="p-3">

                <span
                  className={`px-4 py-2 rounded text-white

                  ${
                    getRoomStatus(roomNo)
                    === "Occupied"
                      ? "bg-red-500"
                      : "bg-green-500"
                  }
                  `}
                >

                  {getRoomStatus(roomNo)}

                </span>

              </td>

              {/* VISITOR */}

              <td className="p-3">

                {getRoomVisitor(roomNo)}

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default RoomAvailability;